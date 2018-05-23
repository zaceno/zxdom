import {h, define, update, mount} from '../dist/zxdom'
import test from 'ava'
import {JSDOM} from 'jsdom'
const dom = new JSDOM('<html><head></head><body></body></html>')
global.window = dom.window
global.document = dom.window.document
const despace = str =>  str.replace(/\n\s*/g, '')

test('define - mount - update - update', t => {
    const component = define(
        props => h('div', {id: props.id}, props.chld),
        {id: 'foo', chld: 'faa'},
    )
    const container = document.createElement('main')
    mount(component, container)
    t.is(container.innerHTML, '<div id="foo">faa</div>')
    update(component, {id: 'bar',  chld: 'baz'})
    t.is(container.innerHTML, '<div id="bar">baz</div>')
    update(component, {id: 'foo',  chld: 'faa'})
    t.is(container.innerHTML, '<div id="foo">faa</div>')
})

test('define - update - mount - update', t => {
    const component = define(
        props => h('div', {id: props.id}, props.chld),
        {id: 'foo', chld: 'faa'},
    )
    update(component, {id: 'bar',  chld: 'baz'})
    const container = document.createElement('main')
    mount(component, container)
    t.is(container.innerHTML, '<div id="bar">baz</div>')
    update(component, {id: 'foo',  chld: 'faa'})
    t.is(container.innerHTML, '<div id="foo">faa</div>')
})


test('define with no initial props - update - mount', t => {
    const component = define(props => h('div', {id: props.id}, props.chld))
    update(component, ({id: 'foo', chld: 'faa'}))
    const container = document.createElement('main')
    mount(component, container)
    t.is(container.innerHTML, '<div id="foo">faa</div>')
})

test('define with no initial props - mount - update', t => {
    const component = define(props => h('div', {id: (props.id || '')}, (props.chld || '')))
    const container = document.createElement('main')
    mount(component, container)
    t.is(container.innerHTML, '<div id=""></div>')
    update(component, {id: 'foo', chld: 'faa'})
    t.is(container.innerHTML, '<div id="foo">faa</div>')
})


test('component as child, no initial state', t => {
    const component = define((props, children) => h('p', {id: 'foo'}, 'bar'))
    const container = document.createElement('main')
    mount(h('div', {}, [h(component)]), container)
    t.is(container.innerHTML, '<div><p id="foo">bar</p></div>')
})



//NOw We need to test: outer component updates with new props and children
//Inner component updates with its props and children
// and inner props always overwrite the main.

test('components composed', t => {
    const container = document.createElement('main')

    const inner = define((props, children) => h('p',
        {
            id: props.innerid,
            'data-outer': props.fromouter,
            'data-own': props.owninner
        },
        props.innerchild,
        children
    ), {
        innerid: 'iid-a',
        owninner: 'inner-a',
        innerchild: 'innerchild-a'
    })

    const outer = define(props => h('div', {id: props.outerid}, [
        'outerfoo',
        h(inner, {id: props.innerid, fromouter: props.fromouter}, [props.outerchild])
    ]), {
        outerid: 'oid-a',
        innerid: 'overwrite-a',
        fromouter: 'fout-a',
        outerchild: 'outerchild-a'
    })

    mount(outer, container)

    t.is(container.innerHTML, despace(`
        <div id="oid-a">
            outerfoo
            <p id="iid-a" data-outer="fout-a" data-own="inner-a">
                innerchild-a
                outerchild-a
            </p>
        </div>
    `))

    update(inner, {
        innerid: 'iid-b',
        owninner: 'inner-b',
        innerchild: 'innerchild-b'        
    })

    t.is(container.innerHTML, despace(`
        <div id="oid-a">
            outerfoo
            <p id="iid-b" data-outer="fout-a" data-own="inner-b">
                innerchild-b
                outerchild-a
            </p>
        </div>
    `))

    update(outer, {
        outerid: 'oid-b',
        innerid: 'overwrite-b',
        fromouter: 'fout-b',
        outerchild: 'outerchild-b'
    })

    t.is(container.innerHTML, despace(`
        <div id="oid-b">
            outerfoo
            <p id="iid-b" data-outer="fout-b" data-own="inner-b">
                innerchild-b
                outerchild-b
            </p>
        </div>
    `))

    update(inner, {
        innerid: 'iid-c',
        owninner: 'inner-c',
        innerchild: 'innerchild-c'        
    })

    t.is(container.innerHTML, despace(`
        <div id="oid-b">
            outerfoo
            <p id="iid-c" data-outer="fout-b" data-own="inner-c">
                innerchild-c
                outerchild-b
            </p>
        </div>
    `))

})