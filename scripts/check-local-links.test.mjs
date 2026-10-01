import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import test from 'node:test';
import MarkdownIt from 'markdown-it';
import { checkLocalLinks } from './check-local-links.mjs';

// Model files and symlinks entirely in memory: no generated fixture writes.
const root = '/repository';
function check(text, targets = {}, aliases = {}) {
  const entries = new Map(Object.entries({ 'source.md': text, ...targets })
    .map(([name, content]) => [path.resolve(root, name), content]));
  const links = new Map(Object.entries(aliases)
    .map(([name, destination]) => [path.resolve(root, name), destination]));
  const fs = {
    realpathSync(file) {
      const resolved = links.get(file) ?? file;
      if (resolved !== root && !entries.has(resolved)) throw new Error('ENOENT: missing file');
      return resolved;
    },
    readFileSync(file) { return entries.get(file); },
    statSync(file) { return { isFile: () => entries.has(file) }; },
  };
  return checkLocalLinks(root, ['source.md'], fs);
}

function rejects(text, pattern, targets, aliases) {
  const errors = check(text, targets, aliases);
  assert.equal(errors.length, 1, errors.join('\n'));
  assert.match(errors[0], pattern);
}

test('missing local files are failures, including images and reference links', () => {
  rejects('[missing](absent.md)', /ENOENT/);
  rejects('![missing](absent.svg)', /ENOENT/);
  rejects('[missing][ref]\n\n[ref]: absent.md', /ENOENT/);
});

test('both cross-file and same-file fragments must exist', () => {
  rejects('[wrong](target.md#absent)', /missing Markdown anchor/, { 'target.md': '# Present' });
  rejects('# Present\n[wrong](#absent)', /missing Markdown anchor/);
  assert.deepEqual(check('# Present\n[ok](#present)\n[ok](target.md#other)', {
    'target.md': '# Other',
  }), []);
});

test('GitHub heading slugs include formatting, Unicode, punctuation and duplicate collisions', () => {
  const headings = '# Hello *World* `code`!\n# Café\n# Repeat\n# Repeat\n# Repeat-1\n# Repeat';
  const links = ['hello-world-code', 'café', 'repeat', 'repeat-1', 'repeat-1-1', 'repeat-2']
    .map(slug => `[ok](#${encodeURIComponent(slug)})`).join('\n');
  assert.deepEqual(check(`${headings}\n${links}`), []);
  rejects('# Title\n[wrong](#Title)', /missing Markdown anchor/);
  assert.deepEqual(check('Setext title\n===\n[ok](#setext-title)'), []);
});

test('fenced and indented code do not create headings or links', () => {
  assert.deepEqual(check('```md\n# Fake\n[missing](absent.md)\n```\n\n    [missing](absent.md)'), []);
  rejects('~~~md\n# Fake\n~~~\n[wrong](#fake)', /missing Markdown anchor/);
  rejects('    # Fake\n\n[wrong](#fake)', /missing Markdown anchor/);
  assert.deepEqual(check('`[missing](absent.md)`'), []);
});

test('encoded paths and fragments, query strings and root-relative paths resolve locally', () => {
  assert.deepEqual(check('[ok](docs/a%20b.md?view=1#caf%C3%A9)\n[ok](/docs/a%20b.md#caf%C3%A9)', {
    'docs/a b.md': '# Café',
  }), []);
  rejects('[bad](target.md#%FF)', /URI malformed/, { 'target.md': '# Title' });
  rejects('[bad](bad%FF.md)', /URI malformed/);
  rejects('[bad](bad%00.md)', /invalid local path/);
});

test('HTTP(S), mailto and protocol-relative destinations are excluded', () => {
  assert.deepEqual(check('[a](https://invalid.example/#missing)\n[b](http://invalid.example)\n'
    + '[c](mailto:person@example.invalid)\n[d](//invalid.example/missing.md)'), []);
  rejects('[bad](ftp://invalid.example/file)', /unsupported URL scheme/);
});

test('lexical traversal and symlink escapes are rejected', () => {
  rejects('[bad](../outside.md)', /path escapes repository root/);
  rejects('[bad](%2e%2e/outside.md)', /path escapes repository root/);
  rejects('[bad](alias.md)', /symlink escapes repository root/,
    { '../outside.md': '# Outside' }, { 'alias.md': '/outside.md' });
  rejects('[bad](alias.md)', /symlink escapes repository root/,
    { '../repository-other/file.md': '# Outside' }, { 'alias.md': '/repository-other/file.md' });
  assert.deepEqual(check('[ok](alias.md#inside)', { 'target.md': '# Inside' }, {
    'alias.md': '/repository/target.md',
  }), []);
  rejects('[bad](alias.md#absent)', /missing Markdown anchor/,
    { 'target.txt': '# Inside' }, { 'alias.md': '/repository/target.txt' });
  rejects('[bad](alias.txt#absent)', /missing Markdown anchor/,
    { 'target.md': '# Inside' }, { 'alias.txt': '/repository/target.md' });
});

test('source symlinks cannot escape the repository', () => {
  const fs = {
    realpathSync: file => file === root ? root : '/outside.md',
  };
  assert.match(checkLocalLinks(root, ['source.md'], fs)[0], /symlink escapes repository root/);
});

test('non-Markdown asset fragments only require the file to exist', () => {
  assert.deepEqual(check('![ok](asset.svg#gh-dark-mode-only)', { 'asset.svg': '<svg/>' }), []);
});

test('parsed HTML links and named anchors remain supported, but fenced HTML is ignored', () => {
  assert.deepEqual(check('<a id="custom"></a>\n[ok](#custom)\n<a href="target.md#title">ok</a>', {
    'target.md': '# Title',
  }), []);
  rejects('<img src="missing.svg">', /ENOENT/);
  assert.deepEqual(check('```html\n<a href="absent.md">fake</a>\n```'), []);
});

test('HTML comments neither define anchors nor create local links', () => {
  rejects('<!-- <a id="ghost"></a> -->\n\n[bad](#ghost)', /missing Markdown anchor/);
  assert.deepEqual(check('<!-- <a href="missing.md">not rendered</a> -->'), []);
  assert.deepEqual(check('<!--\n<a href="missing.md" id="ghost">hidden</a>\n-->'), []);
  rejects('<!--\n<div id="ghost"></div>\n-->\n\n[bad](#ghost)', /missing Markdown anchor/);
});

test('generic HTML elements define IDs, including quoted greater-than characters', () => {
  assert.deepEqual(check('<div id="custom"></div>\n\n[ok](#custom)'), []);
  assert.deepEqual(check('<section title="a > b" id="custom"></section>\n\n[ok](#custom)'), []);
  assert.deepEqual(check("<span id='a>b'></span>\n\n[ok](#a%3Eb)"), []);
  assert.deepEqual(check('<div ID=custom></div>\n\n[ok](#custom)'), []);
  rejects('<div title=\'id="ghost" href="missing.md"\'></div>\n\n[bad](#ghost)',
    /missing Markdown anchor/);
  assert.deepEqual(check('<a title="a > b" href="target.md">ok</a>', { 'target.md': '# Target' }), []);
});

test('HTML IDs preserve literal backslashes instead of matching Markdown-unescaped fragments', () => {
  const html = String.raw`<div id="a\!b"></div>`;
  const text = `${html}\n\n[bad](#a!b)`;
  assert.equal(new MarkdownIt({ html: true }).render(text), `${html}\n<p><a href="#a!b">bad</a></p>\n`);
  rejects(text, /missing Markdown anchor/);
});

test('percent-encoded backslash fragments match literal HTML IDs', () => {
  const html = String.raw`<div id="a\!b"></div>`;
  const text = `${html}\n\n[ok](#a%5C!b)`;
  assert.equal(new MarkdownIt({ html: true }).render(text), `${html}\n<p><a href="#a%5C!b">ok</a></p>\n`);
  assert.deepEqual(check(text), []);
});

test('HTML href backslashes remain invalid local paths even when the unescaped file exists', () => {
  const html = String.raw`<a href="target\.md">bad</a>`;
  assert.equal(new MarkdownIt({ html: true }).render(html), `<p>${html}</p>\n`);
  rejects(html, /invalid local path/, { 'target.md': '# Target' });
});

test('HTML attributes decode named and numeric entities with attribute-context semantics', () => {
  const html = '<div id="a&amp;b&#33;&#x5C;c"></div>';
  assert.equal(new MarkdownIt({ html: true }).render(html), html);
  assert.deepEqual(check(`${html}\n\n[ok](#a%26b!%5Cc)`), []);
  assert.deepEqual(check('<a href="a&amp;b.md&#35;title">ok</a>', {
    'a&b.md': '# Title',
  }), []);
  rejects('<a href="target&#92;.md">bad</a>', /invalid local path/, { 'target.md': '# Target' });
  assert.deepEqual(check(`${String.raw`<div id="a\&amp;b"></div>`}\n\n[ok](#a%5C%26b)`), []);
  assert.deepEqual(check('<div id="a&copy;b"></div>\n\n[ok](#a%C2%A9b)'), []);
  assert.deepEqual(check('<div id="a&copyb"></div>\n\n[ok](#a%26copyb)'), []);
  assert.deepEqual(check('<div id="a&amp;copy;b"></div>\n\n[ok](#a%26copy%3Bb)'), []);
});

test('semicolonless HTML references decode IDs and destinations exactly once', () => {
  assert.deepEqual(check('<div id="a&#33"></div>\n\n[ok](#a!)'), []);
  rejects('<div id="a&#33"></div>\n\n[bad](#a%26%2333)', /missing Markdown anchor/);
  assert.deepEqual(check('<a href="target.md&#35title">ok</a>', { 'target.md': '# Title' }), []);
  assert.deepEqual(check('<div id="a&copy"></div>\n\n[ok](#a%C2%A9)'), []);
  assert.deepEqual(check('<div id="a&#x21"></div>\n\n[ok](#a!)'), []);
  assert.deepEqual(check('<div id="a&#0&#x80;"></div>\n\n[ok](#a%EF%BF%BD%E2%82%AC)'), []);
});

test('ambiguous semicolonless named references stay literal in HTML attributes', () => {
  for (const suffix of ['x', '=value', '1']) {
    const literal = `a&copy${suffix}`;
    assert.deepEqual(check(`<div id="${literal}"></div>\n\n[ok](#${encodeURIComponent(literal)})`), []);
    rejects(`<div id="${literal}"></div>\n\n[bad](#a%C2%A9${suffix})`, /missing Markdown anchor/);
  }
  assert.deepEqual(check('<a href="a&copyx.md">ok</a>', { 'a&copyx.md': '# Target' }), []);
  assert.deepEqual(check('<a href="a&copy=value.md">ok</a>', { 'a&copy=value.md': '# Target' }), []);
});

test('semicolonless decoding preserves backslashes and does not expose commented HTML', () => {
  const html = String.raw`<div id="a\&#33"></div>`;
  assert.deepEqual(check(`${html}\n\n[ok](#a%5C!)`), []);
  rejects(`${html}\n\n[bad](#a!)`, /missing Markdown anchor/);
  rejects(String.raw`<a href="target&#92.md">bad</a>`, /invalid local path/, { 'target.md': '# Target' });
  assert.deepEqual(check('<!-- <a href="missing.md&#35title" id="a&copy"></a> -->'), []);
  rejects('<!-- <div id="a&#33"></div> -->\n\n[bad](#a!)', /missing Markdown anchor/);
});

test('adjacent and multiline mixed HTML comments preserve only rendered elements', () => {
  const mixed = '<div id="before"><!--\n<a href="missing.md" id="ghost">hidden</a>\n'
    + '--><span id="after"></span></div>\n\n[ok](#before) [ok](#after)';
  assert.deepEqual(check(mixed), []);
  rejects(`${mixed}\n[bad](#ghost)`, /missing Markdown anchor/);
  assert.deepEqual(check('text <!-- <img src="missing.svg"> --><a href="target.md">ok</a>', {
    'target.md': '# Target',
  }), []);
  rejects('<!-- hidden --><img src="missing.svg">', /ENOENT/);
  assert.deepEqual(check('<div id="visible"></div><!-- unclosed\n<a href="missing.md">hidden'), []);
  const split = '<div><!-- hidden\n\n<a href="missing.md" id="ghost">hidden</a>\n\n'
    + '<div>--><span id="visible"></span></div>\n\n[ok](#visible)';
  assert.deepEqual(check(split), []);
  rejects(`${split}\n[bad](#ghost)`, /missing Markdown anchor/);
  assert.deepEqual(check('<div><!-- hidden\n\n[hidden](missing.md)\n\n'
    + '<div>--></div>\n\n[ok](target.md)', { 'target.md': '# Target' }), []);
});

test('each run has independent document caches', () => {
  assert.deepEqual(check('# Old\n[ok](#old)'), []);
  rejects('# New\n[wrong](#old)', /missing Markdown anchor/);
});

test('CLI exits nonzero for missing files and invalid arguments, and zero for valid sources', () => {
  const run = (...args) => spawnSync(process.execPath, ['scripts/check-local-links.mjs', ...args], {
    encoding: 'utf8',
  });
  const missing = run('--root', '.', 'scripts/absent-regression-fixture.md');
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /ENOENT/);
  assert.match(missing.stdout, /1 local link error/);
  assert.equal(run('--root').status, 1);
  assert.equal(run('--unsupported').status, 1);
  assert.equal(run('--root', '.', 'AGENTS.md').status, 0);
});
