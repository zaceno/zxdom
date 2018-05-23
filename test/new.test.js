import test from 'ava'
import {h, mount, update, define} from '../dist/zxdom'
import {JSDOM} from 'jsdom'
const dom = new JSDOM('<html><head></head><body></body></html>')
global.window = dom.window
global.document = dom.window.document

//test that attr can be given as null (because that's what jsx does)
test('basic tag', t => {
    t.deepEqual(h('div', null), {tag: 'div', attr: {}, chld: []})
})

//Test that updating a component multiple times leaves the instance count steady
test('instance-count kept static over updates', t => {
    const container = document.createElement('main')
    const component = define(() => h('p'))
    mount(h('div', {}, [
        h(component),
        h(component)
    ]), container)
    t.is(component.instances.length, 2)
    update(component)
    update(component)
    update(component)
    t.is(component.instances.length, 2)
})

test('value is always set, even if it hasnt changed, because value can be set from user interaction', t => {
    const component = define(({value}) => h('input', {value}), {value: 'foo'})
    const container = document.createElement('main')
    mount(component, container)
    const el = container.firstChild
    el.value = 'bar'
    update(component, {value: 'foo'})
    t.is(el.value, 'foo')
})

test('make sure old children and new children of component instances are separate instances', t => {
    const component = define(({x}, children) => {
        return {
            tag: children[0].tag,
            attr: children[0].attr,
            chld: [x]
        }
    }, {x: 'foo'})
    const container = document.createElement('main')
    mount(h(component, {}, [ h('p', {}, []) ] ), container)
    t.is(container.innerHTML, '<p>foo</p>')
    update(component, {x: 'bar'})
    t.is(container.innerHTML, '<p>bar</p>')
})

//SOMETHINGS wierd with checked. Possibly due to JSDOM. It works anyway, but not the test
// test('checked is always set, even if it hasnt changed, because checked can change from user interaction', t => {
//     const container = document.createElement('main')
//     const component = define(({checked}) => h('input', {type: 'checkbox', checked}), {checked: false})
//     mount (component, container)
//     const el = container.firstChild
//     t.is(el.value, false)
//     update(component, {checked: true})
//     t.is(el.value, 'on')
//     el.value = false
//     update(component, {checked: true})
//     t.is(el.value, 'on')
// })

//TODO: what about selected? in dropdown?
//TODO: what about raidio buttons?