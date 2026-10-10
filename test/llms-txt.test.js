'use strict'

const test = require('node:test');
const assert = require('node:assert/strict');

const {buildLlmsTxt} = require('../lib/llms-txt');

test('llms.txt links to sibling markdown for .html pages', () => {
    const config = {
        title: 'My Blog',
        url: 'https://example.com/'
    };

    const cfg = {};

    const result = buildLlmsTxt([
        {
            title: 'Hello',
            path: 'hello.html',
            section: 'Posts',
            excerpt: 'Hello world',
        }
    ], config, cfg);

    assert.match(result, /\[Hello]\(https:\/\/example\.com\/hello\.md\)/);
    assert.doesNotMatch(result, /hello\.html\/index\.md/);
});

test('llms.txt links to index.md for pretty URLs', () => {
    const config = {
        title: 'My Blog',
        url: 'https://example.com/',
    };

    const result = buildLlmsTxt([
        {
            title: 'Hello',
            path: 'hello/',
            section: 'Posts',
            excerpt: 'Hello world',
        },
    ], config, {});

    assert.match(result, /\[Hello]\(https:\/\/example\.com\/hello\/index\.md\)/);
});
