'use strict';

// Normalize a page path to the key form used in the `emitted` Set: no leading
// slash, exactly one trailing slash, and no `index.html`. The generator derives it
// from `post.path` (already `2016/12/25/slug/`) and the injector derives it from the
// page's canonical URL — both must produce the identical key, so keep them here.
function normalizePath(p) {
  if (!p) return '';
  let out = String(p).trim();
  out = out.replace(/^\/+/, ''); // drop leading slash
  out = out.replace(/index\.html?$/i, ''); // drop trailing index.html
  if (out && !out.endsWith('/')) out += '/';
  return out;
}

// Strip a trailing slash from the site url so joins don't double up.
function siteBase(config) {
  return String(config.url || '').replace(/\/+$/, '');
}

// Absolute URL of a page from its (normalized) path: https://host/2016/.../slug/
function pageUrl(config, path) {
  const base = siteBase(config);
  const rawPath = path ? String(path).trim().replace(/^\/+/, '') : '';
  const isHtmlFile = /\.html?$/i.test(rawPath) && !/(^|\/)index\.html?$/i.test(rawPath);
  const p = isHtmlFile ? rawPath : normalizePath(path);
  return p ? `${base}/${p}` : `${base}/`;
}

function markdownPath(path) {
  if (!path) {
    return '';
  }

  // /foo/index.html -> /foo/index.md
  let sanitizedPathString = String(path).trim().replace(/^\/+/, '');
  if (/index\.html?$/i.test(sanitizedPathString)) {
    return sanitizedPathString.replace(/index\.html?$/i, 'index.md');
  }

  // /foo.html -> foo.md
  if (/\.html?$/i.test(sanitizedPathString)) {
    return sanitizedPathString.replace(/\.html?$/i, '.md');
  }

  // For files not ended with .html, keep treating them as directories
  if (!sanitizedPathString.endsWith('/')) {
    sanitizedPathString += '/'
  }

  return sanitizedPathString + 'index.md';
}

function markdownUrl(config, path) {
  const base = siteBase(config);
  const mdPath = markdownPath(path);
  return mdPath ? `${base}/${mdPath}` : `${base}/`;
}

// Escape a string for use as a double-quoted YAML scalar.
function yamlString(s) {
  return '"' + String(s == null ? '' : s).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
}

// Collect tag/category names from a Hexo Warehouse collection (has `.data`) or an array.
function names(collection) {
  if (!collection) return [];
  const arr = collection.data ? collection.data : collection;
  if (!Array.isArray(arr)) return [];
  return arr.map((t) => (t && t.name != null ? t.name : t)).filter(Boolean);
}

module.exports = { normalizePath, siteBase, pageUrl, markdownPath, markdownUrl, yamlString, names };
