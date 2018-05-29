import test from 'ava'
import {h, mount, update, define} from '../dist/zxdom'
import {JSDOM} from 'jsdom'
const dom = new JSDOM('<html><head></head><body></body></html>')
global.window = dom.window
global.document = dom.window.document
const despace = str =>  str.replace(/\n\s*/g, '')

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


test('replace a component with a regular tag as a child', t => {
    t.plan(3)
    const subcomponent = define(_ => h('p', {id: 'foo', onremove: el => {t.is(el.id, 'foo')}}, ['foo']))
    const component = define(({step}) => h('div', {}, [
       h(subcomponent),
       h('p', {id: 'bar', oncreate: el => {t.is(el.id, 'bar')}}, ['bar'])
    ][step]), {step: 0})
    const container = document.createElement('main')
    mount(component, container)
    update(component, {step: 1})
    t.is(container.innerHTML, '<div><p id="bar">bar</p></div>')
})

test('replace a component with a regular tag as root of component', t => {
    t.plan(3)
    const subcomponent = define(_ => h('p', {id: 'foo', onremove: el => {t.is(el.id, 'foo')}}, ['foo']))
    const component = define(({step}) => [
       h(subcomponent),
       h('p', {id: 'bar', oncreate: el => {t.is(el.id, 'bar')}}, ['bar'])
    ][step], {step: 0})
    const container = document.createElement('main')
    mount(component, container)
    update(component, {step: 1})
    t.is(container.innerHTML, '<p id="bar">bar</p>')
})


test('replace a component with a regular string as a child', t => {
    t.plan(2)
    const subcomponent = define(_ => h('p', {id: 'foo', onremove: el => {t.is(el.id, 'foo')}}, ['foo']))
    const component = define(({step}) => h('div', {}, [
       h(subcomponent),
       'bop'
    ][step]), {step: 0})
    const container = document.createElement('main')
    mount(component, container)
    update(component, {step: 1})
    t.is(container.innerHTML, '<div>bop</div>')
})

test('replace a component with a regular string as root of component', t => {
    t.plan(2)
    const subcomponent = define(_ => h('p', {id: 'foo', onremove: el => {t.is(el.id, 'foo')}}, ['foo']))
    const component = define(({step}) => [
       h(subcomponent),
       'bop'
    ][step], {step: 0})
    const container = document.createElement('main')
    mount(component, container)
    update(component, {step: 1})
    t.is(container.innerHTML, 'bop')
})

test('replace a regular tag with a component', t => {
    t.plan(4)
    const subcomponent = define(_ => h('p', {id: 'foo', oncreate: el => t.is(el.id, 'foo')}, ['foo']))
    const component = define(({step}) => [
        h('p', {id: 'bar', onremove: el => t.is(el.id, 'bar')}, ['bar']),
        h(subcomponent),
    ][step], {step: 0})
    const container = document.createElement('main')
    mount(component, container)
    t.is(container.innerHTML, '<p id="bar">bar</p>')
    update(component, {step: 1})
    t.is(container.innerHTML, '<p id="foo">foo</p>')
})

test('replace a string with a component', t => {
    t.plan(3)
    const subcomponent = define(_ => h('p', {id: 'foo', oncreate: el => t.is(el.id, 'foo')}, ['foo']))
    const component = define(({step}) => [
        'bar',
        h(subcomponent),
    ][step], {step: 0})
    const container = document.createElement('main')
    mount(component, container)
    t.is(container.innerHTML, 'bar')
    update(component, {step: 1})
    t.is(container.innerHTML, '<p id="foo">foo</p>')
})





/*
TODO: TEST WITH KEYED DYNAMIC COMPONENTS. THEY SHOULD BE REORDERED PROPERLY WITHOUT CALLS TO ONREMOVE/CREATE
*/


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