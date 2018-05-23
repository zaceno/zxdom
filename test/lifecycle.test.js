import test from 'ava'
import {h, mount, update, define} from '../dist/zxdom'
import {JSDOM} from 'jsdom'
const dom = new JSDOM('<html><head></head><body></body></html>')
global.window = dom.window
global.document = dom.window.document

/*
when an elment is removed, onremvoe is called.
when a child of a removed element has onremove, it is also called on removal
when an element is replaced with a different one, onremove is called on the old one and oncreate is called on the new one
when an element is not created ior remvoed, onupdate is called, when the node is patched, each time
*/

test('oncreate called when new element created', t => {
    t.plan(2)
    const component = define(({step}) => h('div', {
        oncreate: el => t.is(el.tagName, 'DIV')
    }, [
        h('p', {}, ['foo']),
        step > 1 ? h('p', {
            oncreate: el => t.is(el.tagName, 'P')
        }, ['bar']) : ''
    ]), {step: 1})
    const container = document.createElement('main')
    mount(component, container)
    update(component, {step: 2})
    update(component, {step: 3})
})

test('onremove called when element is removed, and only then', t => {
    t.plan(2)
    const component = define(({step}) => {
        return h('div', {}, [
            (
                step === 1
                ? h('div', { onremove: el => t.is(el.tagName, 'DIV')}, [
                    h('p', {}, [
                        h('span', {
                            onremove: el => t.is(el.tagName, 'SPAN')
                        }, ['foo'])
                    ])
                ])
                : ''
            )
        ])
    }, {step: 1})
    const container = document.createElement('main')
    mount(component, container)
    update(component, {step: 2})

})

test('onremove called when top element in a component is replaced', t => {
    t.plan(2)
    const component = define(({step}) => step === 1 ? h('div', {
            onremove: el => t.is(el.tagName, 'DIV')
    }, [
        h('p', {}, [
            h('span', {
                onremove: el => t.is(el.tagName, 'SPAN')
            }, 'foo')
        ])
    ]) : '', {step: 1})
    const container = document.createElement('main')
    mount(component, container)
    update(component, {step: 2})    
})

test('onremove called when a child node is replaced with a different node', t => {
    t.plan(1)
    const component = define(({step}) => h('div', {}, [
        step > 1 ? h('p', {}, ['foo']) : h('div', {
            oncreate: el => t.is(el.tagName, 'DIV')
        }, ['foo'])
    ]), {step: 1})
    const container = document.createElement('main')
    mount(component, container)
    update(component, {step: 2})
})

test('onremove called for plainly deleted nodes', t => {
    t.plan(2)
    const component = define(({step}) => h('div', {}, 
        (step === 1
        ? [
            h('div', {}, ['foo']),
            h('p', {onremove: el => t.is(el.tagName, 'P')}, [
                h('span', {onremove: el => t.is(el.tagName, 'SPAN')}, ['bar'])
            ])
        ]
        : [
            h('div', {}, ['foo'])
        ])
    ), {step: 1})
    const container = document.createElement('main')
    mount(component, container)
    update(component, {step: 2})
})

test('onremove is called when a component is changed for a different one', t => {
    t.plan(1)
    const comp1 = define(_ => h('div', {id: 'foo', onremove: el => t.is(el.id, 'foo')}, ['x']))
    const comp2 = define(_ => h('div', {id: 'bar', onremove: el => t.is(el.id, 'bar')}, ['y']))
    const main = define(({step}) => h('div', {}, [
        h(step === 1 ? comp1 : comp2, {}, [])
    ]), {step: 1})
    const container = document.createElement('main')
    mount(main, container)
    update(main, {step: 2})
})

test('onupdate called for children, when they are updated', t => {
    t.plan(2)
    const component = define(({id}) => h('div', {id, onupdate: el => t.is(el.id, 'bar')}, [
        h('div', {id, onupdate: el => t.is(el.id, 'bar')}, ['xxx'])
    ]), {id: 'foo'})
    const container = document.createElement('main')
    mount(component, container)
    update(component, {id: 'bar'})
})