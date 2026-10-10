'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
    normalizePath,
    pageUrl,
    markdownPath,
    markdownUrl
} = require('../lib/util');

test('normalizePath keeps the emitted key independent of HTML file name form', () => {
    assert.strictEqual(normalizePath('foo/'), 'foo/');
    assert.strictEqual(normalizePath('/foo/'), 'foo/');
    assert.strictEqual(normalizePath('foo/index.html'), 'foo/');
    assert.strictEqual(normalizePath('/foo/index.html'), 'foo/');
    assert.strictEqual(normalizePath('foo.html'), 'foo.html/');
});

test('pageUrl preserves explicit HTML filenames and normalizes directory paths', () => {
    const config = { url: 'https://example.com/' };

    assert.strictEqual(pageUrl(config, 'foo.html'), 'https://example.com/foo.html');
    assert.strictEqual(pageUrl(config, 'foo/'), 'https://example.com/foo/');
});

test('markdownPath converts .html files to sibling .md files', () => {
    assert.strictEqual(markdownPath('foo.html'), 'foo.md');
    assert.strictEqual(markdownPath('/foo.html'), 'foo.md');
    assert.strictEqual(markdownPath('foo/bar.html'), 'foo/bar.md');
});

test('markdownPath converts index.html to index.md', () => {
    assert.strictEqual(markdownPath('foo/index.html'), 'foo/index.md');
    assert.strictEqual(markdownPath('/foo/index.html'), 'foo/index.md');
});

test('markdownPath keeps pretty URLs as index.md', () => {
    assert.strictEqual(markdownPath('foo/'), 'foo/index.md');
    assert.strictEqual(markdownPath('/foo/'), 'foo/index.md');
});

test('markdownPath handles a bare path as a pretty URL', () => {
    assert.strictEqual(markdownPath('foo'), 'foo/index.md');
});

test('markdownUrl builds URLs for .html permalinks', () => {
    const config = {
        url: 'https://example.com/'
    };

    assert.strictEqual(markdownUrl(config, 'foo.html'), 'https://example.com/foo.md');
});

test('markdownUrl build URLs for pretty permalinks', () => {
    const config = {
        url: 'https://example.com/'
    };

    assert.strictEqual(markdownUrl(config, 'foo/index.html'), 'https://example.com/foo/index.md');
    assert.strictEqual(markdownUrl(config, 'foo/'), 'https://example.com/foo/index.md');
});
