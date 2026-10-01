import { execFileSync } from 'node:child_process';
import * as filesystem from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import MarkdownIt from 'markdown-it';
import { HTML_TAG_RE } from 'markdown-it/lib/common/html_re.mjs';
import GithubSlugger from 'github-slugger';
import { decodeHTMLAttribute } from 'entities';

// Markdown destinations come from parser tokens, including reference links.
const markdown = new MarkdownIt({ html: true });

function* htmlElements(content, state) {
  // Reuse the pinned Markdown parser's HTML grammar for complete lexical units:
  // comments/declarations are consumed whole, and quoted > never ends a tag.
  for (let cursor = 0; cursor < content.length;) {
    if (state.comment) {
      const end = content.indexOf('-->', cursor);
      if (end < 0) return;
      state.comment = false;
      cursor = end + 3;
    }
    const start = content.indexOf('<', cursor);
    if (start < 0) break;
    const match = HTML_TAG_RE.exec(content.slice(start));
    if (!match) {
      if (content.startsWith('<!--', start)) {
        state.comment = true; // Comments may span multiple parsed HTML tokens.
        cursor = start + 4;
      } else cursor = start + 1;
      continue;
    }
    const tag = match[0];
    cursor = start + tag.length;
    if (!/[A-Za-z]/.test(tag[1])) continue;

    // Read attributes with a cursor, not a search that can match inside values.
    let position = 1;
    const space = () => { while (/\s/.test(tag[position] ?? '') && position < tag.length) position++; };
    const nameStart = position;
    while (/[A-Za-z0-9-]/.test(tag[position] ?? '') && position < tag.length) position++;
    const name = tag.slice(nameStart, position).toLowerCase();
    const attributes = new Map();
    while (position < tag.length) {
      space();
      if (tag[position] === '/' || tag[position] === '>') break;
      const attributeStart = position;
      while (position < tag.length && !/[\s=/>]/.test(tag[position])) position++;
      const attribute = tag.slice(attributeStart, position).toLowerCase();
      space();
      let value = '';
      if (tag[position] === '=') {
        position++;
        space();
        const quote = tag[position];
        if (quote === '"' || quote === "'") {
          const valueStart = ++position;
          while (tag[position] !== quote) position++;
          value = tag.slice(valueStart, position++);
        } else {
          const valueStart = position;
          while (position < tag.length && !/[\s>]/.test(tag[position])) position++;
          value = tag.slice(valueStart, position);
        }
      }
      // Attribute-context decoding handles semicolonless references and ambiguous
      // ampersands without Markdown unescaping or stripping literal backslashes.
      // HTML keeps the first occurrence of a duplicate attribute.
      const decoded = decodeHTMLAttribute(value);
      if (!attributes.has(attribute)) attributes.set(attribute, decoded);
    }
    yield { name, attributes };
  }
}

// The filesystem boundary allows regression tests without temporary disk fixtures.
export function checkLocalLinks(rootPath, files, fs = filesystem) {
  const { readFileSync, realpathSync, statSync } = fs;
  const root = realpathSync(rootPath);
  const documents = new Map();

  function confined(file) {
    const relative = path.relative(root, file);
    return relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
  }

  function checkedPath(file) {
    if (!confined(file)) throw new Error('path escapes repository root');
    const real = realpathSync(file);
    if (!confined(real)) throw new Error('symlink escapes repository root');
    return real;
  }

  function inlineText(tokens) {
    return (tokens ?? []).map(token => {
      if (token.type === 'text' || token.type === 'code_inline') return token.content;
      if (token.type === 'image') return inlineText(token.children);
      if (token.type === 'softbreak' || token.type === 'hardbreak') return ' ';
      return '';
    }).join('');
  }

  function document(file) {
    const real = checkedPath(file);
    if (documents.has(real)) return documents.get(real);
    const tokens = markdown.parse(readFileSync(real, 'utf8'), {});
    const slugger = new GithubSlugger();
    const anchors = new Set();
    const links = [];
    const htmlState = { comment: false };
    function collect(token, line) {
      if (!htmlState.comment && token.type === 'link_open') links.push({ url: token.attrGet('href'), line });
      if (!htmlState.comment && token.type === 'image') links.push({ url: token.attrGet('src'), line });
      if (token.type === 'html_inline' || token.type === 'html_block') {
        // HTML is handled only within parsed HTML tokens, never within code fences.
        for (const { name, attributes } of htmlElements(token.content, htmlState)) {
          if (attributes.has('id')) anchors.add(attributes.get('id'));
          if (name === 'a' && attributes.has('name')) anchors.add(attributes.get('name'));
          const destination = name === 'a' ? 'href' : ['img', 'source'].includes(name) ? 'src' : null;
          if (attributes.has(destination)) links.push({ url: attributes.get(destination), line });
        }
      }
      for (const child of token.children ?? []) collect(child, line);
    }
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (!htmlState.comment && token.type === 'heading_open') anchors.add(slugger.slug(inlineText(tokens[i + 1].children)));
      collect(token, (token.map?.[0] ?? 0) + 1);
    }
    const result = { anchors, links };
    documents.set(real, result);
    return result;
  }

  function validate(source, url) {
    if (/^(https?:|mailto:|\/\/)/i.test(url)) return;
    if (/^[a-z][a-z\d+.-]*:/i.test(url)) throw new Error('unsupported URL scheme');
    const hash = url.indexOf('#');
    const fragment = hash < 0 ? '' : decodeURIComponent(url.slice(hash + 1));
    const pathname = decodeURIComponent((hash < 0 ? url : url.slice(0, hash)).split('?')[0]);
    if (pathname.includes('\\') || pathname.includes('\0')) throw new Error('invalid local path');
    const target = pathname
      ? path.resolve(pathname.startsWith('/') ? root : path.dirname(source), pathname.replace(/^\/+/, ''))
      : source;
    const real = checkedPath(target);
    // Non-Markdown resources (including SVG #gh-dark-mode-only) need only exist.
    if (fragment && (/\.md$/i.test(target) || /\.md$/i.test(real))
      && !document(real).anchors.has(fragment)) {
      throw new Error(`missing Markdown anchor #${fragment}`);
    }
  }

  const errors = [];
  for (const file of files) {
    const source = path.resolve(root, file);
    try {
      checkedPath(source);
      if (!statSync(source).isFile()) throw new Error('source is not a file');
      for (const { url, line } of document(source).links) {
        try {
          validate(source, url);
        } catch (error) {
          errors.push(`${file}:${line}: ${url}: ${error.message}`);
        }
      }
    } catch (error) {
      errors.push(`${file}: ${error.message}`);
    }
  }
  return errors;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2);
    if (args[0] === '--root' && !args[1]) throw new Error('--root requires a directory');
    const root = filesystem.realpathSync(args[0] === '--root' ? args.splice(0, 2)[1] : process.cwd());
    if (args.some(arg => arg.startsWith('--'))) throw new Error('unsupported option');
    const files = args.length ? args : execFileSync('git', ['ls-files', '-z', '*.md'], {
      cwd: root, encoding: 'utf8',
    }).split('\0').filter(Boolean);
    const errors = checkLocalLinks(root, files);
    for (const error of errors) console.error(error);
    console.log(`Checked ${files.length} Markdown files; ${errors.length} local link error(s).`);
    process.exitCode = errors.length ? 1 : 0;
  } catch (error) {
    console.error(`Local link check failed: ${error.message}`);
    process.exitCode = 1;
  }
}
