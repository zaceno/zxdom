import {make, patch, h} from '../dist/zxdom'
import test from 'ava'
import {JSDOM} from 'jsdom'
const dom = new JSDOM('<html><head></head><body></body></html>')
global.window = dom.window
global.document = dom.window.document

const despace = str =>  str.replace(/\n\s*/g, '')

const patchTest = ({first, next, expect}) => t => {
    const container = document.createElement('main')
    const el = make(first)
    container.appendChild(el)
    patch(el, first, next)
    t.is(container.innerHTML, despace(expect))
}


test('patch textnode to textnode', patchTest({
    first: 'foo',
    next: 'bar',
    expect: 'bar'
}))

test('patch textnode to htmlelement', patchTest({
    first: 'foo',
    next: h('p', {}, 'foo'),
    expect: '<p>foo</p>'
}))

test('patch htmlelement to textnode', patchTest({
    first: h('p', {}, 'foo'),
    next: 'foo',
    expect: 'foo'
}))

test('patch htmlelement to other htmlelement', patchTest({
    first: h('p', {}, ['foo']),
    next: h('span', {}, ['foo']),
    expect: '<span>foo</span>',
}))

test('patch htmlelement add, remove and change attributes', patchTest({
    first: h('div', {id: 'foo', 'data-a': 'a'}),
    next: h('div', {id: 'bar', 'data-b': 'b'}),
    expect: '<div id="bar" data-b="b"></div>'
}))



test('patch children: add children', patchTest({
    first: h('div', {}, [
        h('p', {id: 'a'}, 'a'),
        h('p', {id: 'b'}, 'b'),
    ]),
    next: h('div', {}, [
        h('div', {id: 'c'}, 'c'),
        h('p', {id: 'a'}, 'a'),
        h('div', {id: 'd'}, 'd'),
        h('p', {id: 'b'}, 'b'),
        h('div', {id: 'e'}, 'e'),
    ]),
    expect: `
        <div>
            <div id="c">c</div>
            <p id="a">a</p>
            <div id="d">d</div>
            <p id="b">b</p>
            <div id="e">e</div>
        </div>
    `
}))

test('patch children: remove children', patchTest({
    first: h('div', {}, [
        h('div', {id: 'c'}, 'c'),
        h('p', {id: 'a'}, 'a'),
        h('div', {id: 'd'}, 'd'),
        h('p', {id: 'b'}, 'b'),
        h('div', {id: 'e'}, 'e'),
    ]),
    next: h('div', {}, [
        h('p', {id: 'a'}, 'a'),
        h('p', {id: 'b'}, 'b'),
    ]),
    expect: `
        <div>
            <p id="a">a</p>
            <p id="b">b</p>
        </div>
    `
}))


test('patch children: update children', patchTest({
    first: h('div', {}, [
        h('div', {id: 'c'}, 'c'),
        h('p', {id: 'a'}, 'a'),
        h('div', {id: 'd'}, 'd'),
        h('p', {id: 'b'}, 'b'),
        h('div', {id: 'e'}, 'e'),
    ]),
    next: h('div', {}, [
        h('div', {id: 'c'}, 'c'),
        h('div', {id: 'a'}, 'a'),
        h('div', {id: 'd'}, 'd'),
        h('p', {id: 'foo'}, 'foo'),
        h('div', {id: 'e'}, 'e'),
    ]),
    expect: `
        <div>
            <div id="c">c</div>
            <div id="a">a</div>
            <div id="d">d</div>
            <p id="foo">foo</p>
            <div id="e">e</div>
        </div>
    `
}))