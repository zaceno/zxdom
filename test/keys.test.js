import test from 'ava'
import {h, mount, update, define} from '../dist/zxdom'
import {JSDOM} from 'jsdom'
const dom = new JSDOM('<html><head></head><body></body></html>')
global.window = dom.window
global.document = dom.window.document
const despace = str =>  str.replace(/\n\s*/g, '')

test('add key makes node created', t => {
    t.plan(2)
    const component = define(({step}) => [
        h('div', {
            id: 'foo',
            onremove: el => t.is(el.id, 'foo')
        }, ['foo']),
        h('div', {
            id: 'bar',
            key: 'key',
            oncreate: el => t.is(el.id, 'bar')
        }, ['bar'])
    ][step], {step: 0})
    const container = document.createElement('main')
    mount(component, container)
    update(component, {step: 1})
})

test('add key makes node created - in child', t => {
    t.plan(2)
    const component = define(({step}) => h('div', {}, [
        h('p', {
            id: 'foo',
            onremove: el => t.is(el.id, 'foo')
        }, ['foo']),
        h('p', {
            id: 'bar',
            key: 'key',
            oncreate: el => t.is(el.id, 'bar')
        }, ['bar'])
    ][step]), {step: 0})
    const container = document.createElement('main')
    mount(component, container)
    update(component, {step: 1})
})

test('remove key makes node removed', t => {
    t.plan(2)
    const component = define(({step}) => [
        h('div', {
            id: 'foo',
            key: 'key',
            onremove: el => t.is(el.id, 'foo')
        }, ['foo']),
        h('div', {
            id: 'bar',
            oncreate: el => t.is(el.id, 'bar')
        }, ['bar'])
    ][step], {step: 0})
    const container = document.createElement('main')
    mount(component, container)
    update(component, {step: 1})
})

test('remove key makes node removed - in child', t => {
    t.plan(2)
    const component = define(({step}) => h('div', {}, [
        h('p', {
            id: 'foo',
            key: 'key',
            onremove: el => t.is(el.id, 'foo')
        }, ['foo']),
        h('p', {
            id: 'bar',
            oncreate: el => t.is(el.id, 'bar')
        }, ['bar'])
    ][step]), {step: 0})
    const container = document.createElement('main')
    mount(component, container)
    update(component, {step: 1})
})

test('keyed node moved, is updated with same element as before', t => {
    t.plan(2)
    const component = define(({step}) => [
        h('div', {}, [
            h('p', {key: 'foo', oncreate: el => el.id = 'foo'}, []),
            h('p', {key: 'bar', oncreate: el => el.id = 'bar'}, [])
        ]),
        h('div', {}, [
            h('p', {key: 'bar', onupdate: el => t.is(el.id, 'bar')}, []),
            h('p', {key: 'foo', onupdate: el => t.is(el.id, 'foo')}, []),
        ])
    ][step], {step: 0})
    const container = document.createElement('main')
    mount(component, container)
    update(component, {step: 1})
})

test('keys reorder properly', t => {
    const keyed = ({key}) => h('p', {
        key: key,
        oncreate: el => {el.id = key},
    }, [key])
    const container = document.createElement('main')
    const main = define(({step}) => h('div', {}, [
        [
            keyed({key: 'aaa'}),
            keyed({key: 'bbb'}),
            keyed({key: 'ccc'}),
            keyed({key: 'ddd'}),
            keyed({key: 'eee'}),
        ],
        [
            keyed({key: 'ccc'}),
            keyed({key: 'eee'}),
            keyed({key: 'bbb'}),
            keyed({key: 'ddd'}),
            keyed({key: 'aaa'}),            
        ]
    ][step]), {step: 0})
    mount(main, container)
    update(main, {step: 1})
    t.is(container.innerHTML, despace(`
        <div>
            <p id="ccc">ccc</p>
            <p id="eee">eee</p>
            <p id="bbb">bbb</p>
            <p id="ddd">ddd</p>
            <p id="aaa">aaa</p>
        </div>
    `))
})

test('keys reorder properly among unkeyed with addition', t => {
    const keyed = ({key}) => h('p', {
        key: key,
        oncreate: el => {el.id = key},
    }, [key])
    const container = document.createElement('main')
    const main = define(({step}) => h('div', {}, [
        [
            keyed({key: 'aaa'}),
            h('p', {}, ['foo']),
            keyed({key: 'bbb'}),
            keyed({key: 'ccc'}),
            h('p', {}, ['bar']),
            keyed({key: 'ddd'}),
            keyed({key: 'eee'}),
        ],
        [
            h('p', {}, ['baz']),
            keyed({key: 'ccc'}),
            keyed({key: 'eee'}),
            h('p', {}, ['bing']),
            keyed({key: 'bbb'}),
            keyed({key: 'ddd'}),
            h('p', {}, ['foo']),
            h('p', {}, ['bar']),
            keyed({key: 'aaa'}),            
        ]
    ][step]), {step: 0})
    mount(main, container)
    update(main, {step: 1})
    t.is(container.innerHTML, despace(`
        <div>
            <p>baz</p>
            <p id="ccc">ccc</p>
            <p id="eee">eee</p>
            <p>bing</p>
            <p id="bbb">bbb</p>
            <p id="ddd">ddd</p>
            <p>foo</p>
            <p>bar</p>
            <p id="aaa">aaa</p>
        </div>
    `))
})


test('keys reorder properly among unkeyed with removal', t => {
    const keyed = ({key}) => h('p', {
        key: key,
        oncreate: el => {el.id = key},
    }, [key])
    const container = document.createElement('main')
    const main = define(({step}) => h('div', {}, [
        [
            h('p', {}, ['baz']),
            keyed({key: 'aaa'}),
            keyed({key: 'bbb'}),
            h('p', {}, ['bing']),
            keyed({key: 'ccc'}),
            keyed({key: 'ddd'}),
            h('p', {}, ['foo']),
            h('p', {}, ['bar']),
            keyed({key: 'eee'}),
        ],
        [
            keyed({key: 'ccc'}),
            keyed({key: 'eee'}),
            h('p', {}, ['foo']),
            keyed({key: 'bbb'}),
            h('p', {}, ['bar']),
            keyed({key: 'ddd'}),
            keyed({key: 'aaa'}),            
        ]
    ][step]), {step: 0})
    mount(main, container)
    update(main, {step: 1})
    t.is(container.innerHTML, despace(`
        <div>
            <p id="ccc">ccc</p>
            <p id="eee">eee</p>
            <p>foo</p>
            <p id="bbb">bbb</p>
            <p>bar</p>
            <p id="ddd">ddd</p>
            <p id="aaa">aaa</p>
        </div>
    `))
})


test('keys reorder properly among textnodes - with addition', t => {
    const keyed = ({key}) => h('p', {
        key: key,
        oncreate: el => {el.id = key},
    }, [key])
    const container = document.createElement('main')
    const main = define(({step}) => h('div', {}, [
        [
            keyed({key: 'aaa'}),
            'foo',
            keyed({key: 'bbb'}),
            keyed({key: 'ccc'}),
            'bar',
            keyed({key: 'ddd'}),
            keyed({key: 'eee'}),
        ],
        [
            'baz',
            keyed({key: 'ccc'}),
            keyed({key: 'eee'}),
            'bing',
            keyed({key: 'bbb'}),
            keyed({key: 'ddd'}),
            'foo',
            'bar',
            keyed({key: 'aaa'}),            
        ]
    ][step]), {step: 0})
    mount(main, container)
    update(main, {step: 1})
    t.is(container.innerHTML, despace(`
        <div>
            baz
            <p id="ccc">ccc</p>
            <p id="eee">eee</p>
            bing
            <p id="bbb">bbb</p>
            <p id="ddd">ddd</p>
            foo
            bar
            <p id="aaa">aaa</p>
        </div>
    `))
})


test('keys reorder properly among textnodes with removal', t => {
    const keyed = ({key}) => h('p', {
        key: key,
        oncreate: el => {el.id = key},
    }, [key])
    const container = document.createElement('main')
    const main = define(({step}) => h('div', {}, [
        [
            'baz',
            keyed({key: 'aaa'}),
            keyed({key: 'bbb'}),
            'bing',
            keyed({key: 'ccc'}),
            keyed({key: 'ddd'}),
            'foo',
            'bar',
            keyed({key: 'eee'}),
        ],
        [
            keyed({key: 'ccc'}),
            keyed({key: 'eee'}),
            'foo',
            keyed({key: 'bbb'}),
            'bar',
            keyed({key: 'ddd'}),
            keyed({key: 'aaa'}),            
        ]
    ][step]), {step: 0})
    mount(main, container)
    update(main, {step: 1})
    t.is(container.innerHTML, despace(`
        <div>
            <p id="ccc">ccc</p>
            <p id="eee">eee</p>
            foo
            <p id="bbb">bbb</p>
            bar
            <p id="ddd">ddd</p>
            <p id="aaa">aaa</p>
        </div>
    `))
})




test('keye components reorder properly among unkeyed with removal', t => {
    t.plan(6)
    const makeComp = key => define(_ => h('p', {
        key,
        id: key,
        oncreate: _ => t.pass(),
        onremove: _ => t.pass(),
    }, [key]))
    const compA = makeComp('aaa')
    const compB = makeComp('bbb')
    const compC = makeComp('ccc')
    const compD = makeComp('ddd')
    const compE = makeComp('eee')
    const container = document.createElement('main')
    const main = define(({step}) => h('div', {}, [
        [
            h('p', {}, ['baz']),
            h(compA),
            h(compB),
            h('p', {}, ['bing']),
            h(compC),
            h(compD),
            h('p', {}, ['foo']),
            h('p', {}, ['bar']),
            h(compE),
        ],
        [
            h(compC),
            h(compE),
            h('p', {}, ['foo']),
            h(compB),
            h('p', {}, ['bar']),
            h(compD),
            h(compA),
            h('p', {}, ['baz']),
        ]
    ][step]), {step: 0})
    mount(main, container)
    update(main, {step: 1})
    t.is(container.innerHTML, despace(`
        <div>
            <p id="ccc">ccc</p>
            <p id="eee">eee</p>
            <p>foo</p>
            <p id="bbb">bbb</p>
            <p>bar</p>
            <p id="ddd">ddd</p>
            <p id="aaa">aaa</p>
            <p>baz</p>
        </div>
    `))
})
