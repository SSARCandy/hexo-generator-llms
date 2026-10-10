'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const emitted = require('../lib/emitted');

function createHexo() {
    const filters = {};
    const helpers = {};

    return {
        config: {
            url: 'https://example.com/',
        },
        extend: {
            filter: {
                register(name, fn) {
                    filters[name] = fn;
                },
            },
            helper: {
                register(name, fn) {
                    helpers[name] = fn;
                },
            },
        },
        filters,
        helpers,
    };
}

test('inject-link uses sibling .md for .html canonical URLs', () => {
    emitted.clear();

    const hexo = createHexo();
    require('../lib/inject-link')(hexo, {});

    emitted.add('hello.html/');

    const html = [
        '<html>',
        '<head>',
        '<link rel="canonical" href="https://example.com/hello.html">',
        '</head>',
        '<body>Hello</body>',
        '</html>',
    ].join('');

    const result = hexo.filters['after_render:html'](html);

    assert.match(
        result,
        /rel="alternate" type="text\/markdown" href="https:\/\/example\.com\/hello\.md"/
    );

    assert.doesNotMatch(
        result,
        /hello\.html\/index\.md/
    );
});

test('inject-link uses index.md for pretty canonical URLs', () => {
    emitted.clear();

    const hexo = createHexo();
    require('../lib/inject-link')(hexo, {});

    emitted.add('hello/');

    const html = [
        '<html>',
        '<head>',
        '<link rel="canonical" href="https://example.com/hello/">',
        '</head>',
        '<body>Hello</body>',
        '</html>',
    ].join('');

    const result = hexo.filters['after_render:html'](html);

    assert.match(
        result,
        /rel="alternate" type="text\/markdown" href="https:\/\/example\.com\/hello\/index\.md"/
    );
});

test('inject-link does not add a link when no markdown twin was emitted', () => {
    emitted.clear();

    const hexo = createHexo();
    require('../lib/inject-link')(hexo, {});

    const html = [
        '<html>',
        '<head>',
        '<link rel="canonical" href="https://example.com/hello.html">',
        '</head>',
        '</html>',
    ].join('');

    const result = hexo.filters['after_render:html'](html);

    assert.equal(result, html);
});
