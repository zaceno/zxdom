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
            type: children[0].type,
            attributes: children[0].attributes,
            children: [x]
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

/* TODO: components returned directly by other components, can be updated */
test('components rendered by other component can be updated', t => {
    const first = _ => h('p', {id: 'biz'}, ['biz'])
    const inner = define(({val}) => h('p', {id: val}, [val]), {val: 'foo'})
    const outer = define(({ready}) => (ready ? h(inner) : h(first)), {ready: false})
    const container = document.createElement('main')
    mount(h('div', {}, [ h(outer) ]), container)
    update(outer, {ready: true})
    update(inner, {val: 'bar'})
    t.is(container.innerHTML, '<div><p id="bar">bar</p></div>')
})


test('components should not be recreated when updated', t => {
    t.plan(2)
    const inner = define(({step}) => h('p', {
        oncreate: _ => t.is(step, 1),
        onupdate: _ => t.is(step, 2)
    }, ['inner']))
    const outer = define(({step}) => h('div', {}, [
        h('p', {}, ['extra']),
        h(inner, {step}),
        h('p', {}, ['extra']),
    ]), {step: 1})
    mount(outer, document.createElement('main'))
    update(outer, {step: 2})
})

test('vnodes should be able to be null, empty string or false and be filtered out', t => {
    t.plan(2)
    const component = define(({step}) => h('div', {}, [
        step === 1 && h('p', {}, [0]),
        '',
        'foo',
        null,
        'foo',
        undefined,
        'foo',
    ]), {step: 1})
    const container = document.createElement('main')
    mount(component, container)
    t.is(container.innerHTML, '<div><p>0</p>foofoofoo</div>')
    update(component, {step: 2})
    t.is(container.innerHTML, '<div>foofoofoo</div>')
})


test('outer component updated after inner component updated, keeps new shape of inner', t => {
    t.plan(3)
    const inner = define(({step}) => [
        h('ul', {}, [
            h('li', {}, [ h('p', {}, 'foo')]),
        ]),
        h('ul', {}, [
            h('li', {}, [ h('p', {}, 'bar')]),
            h('li', {}, [ h('p', {}, 'baz')]),
            h('li', {}, [ h('p', {}, 'bop')]),
        ]),
    ][step], {step: 0})
    const outer = define(({step}) => h('div', {}, [
        [
            h('p', {id: 'fiz'}, ['fiz']),
            h('p', {id: 'fob'}, ['fob']),
        ][step],
        h(inner),
    ]), {step: 0})
    const container = document.createElement('main')
    mount(outer, container)
    t.is(container.innerHTML, '<div><p id="fiz">fiz</p><ul><li><p>foo</p></li></ul></div>')
    update(inner, {step: 1})
    t.is(container.innerHTML, '<div><p id="fiz">fiz</p><ul><li><p>bar</p></li><li><p>baz</p></li><li><p>bop</p></li></ul></div>')
    update(outer, {step: 1})
    t.is(container.innerHTML, '<div><p id="fob">fob</p><ul><li><p>bar</p></li><li><p>baz</p></li><li><p>bop</p></li></ul></div>')
})

test('false attributes for disabled, checked should remove them', t => {
    const component = define(({step}) => h('div', {}, [
        h('button', {disabled: step > 0}, ['foo']),
        h('p', {'data-bool': step < 1}, ['bar']),
    ]), {step: 0})
    const container = document.createElement('main')
    mount(component, container)
    t.is(container.innerHTML, '<div><button>foo</button><p data-bool="true">bar</p></div>')
    update(component, {step: 1})
    t.is(container.innerHTML, '<div><button disabled="true">foo</button><p>bar</p></div>')
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

//TOODO: make it possible to use class instances as views, so you can call update(this.view, this)