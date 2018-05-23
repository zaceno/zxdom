import {make, h} from '../dist/zxdom'
import test from 'ava'
import {JSDOM} from 'jsdom'
const dom = new JSDOM('<html><head></head><body></body></html>')
global.window = dom.window
global.document = dom.window.document

const makeTest = (vnode) => {
    const container = document.createElement('main')
    const el = make(vnode)
    container.appendChild(el)
    return container.innerHTML
}

test('make textnode', t => {
    t.is(makeTest('sometext'), 'sometext')
})

test('make htmlelement', t => {
    t.is(makeTest(h('div')), '<div></div>')
})

test('make htmlelement with children', t => {
    t.is(
        makeTest(h('div', {}, [
            h('p', {}, ['foo']),
            h('p', {}, ['bar']),            
        ])),
        '<div><p>foo</p><p>bar</p></div>'
    )
})

test('make htmlelement with attributes', t => {
    t.is(
        makeTest(h('p', {
            id: 'foo',
            class: 'bar baz',
            'data-foo': 'bing',
        }, 'text')),
        '<p id="foo" class="bar baz" data-foo="bing">text</p>'
    )
})

test('make htmlelement: events are set as props, not attributes', t => {
    const onclick = ev => {}
    const vnode = h('button', { onclick }, 'foo')
    t.is(makeTest(vnode), '<button>foo</button>')
    const el = make(vnode)
    t.is(el.onclick, onclick)
})
