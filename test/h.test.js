import test from 'ava'
import {define, h} from '../dist/zxdom'

test('basic tag', t => {
    t.deepEqual(h('div'), {tag: 'div', attr: {}, chld: []})    
})
test('tag with props', t => {
    t.deepEqual(
        h('div', {id: 'foo'}),
        {tag: 'div', attr: {id: 'foo'}, chld: []}
    )
})

test('tag with children', t => {
    t.deepEqual(
        h('div', {id: 'foo'}, [
            'aaa',
            h('p', {}, 'bar'),
            'bbb',
            h('p', {}, 'baz')
        ]),
        {
            tag: 'div',
            attr: {id: 'foo'},
            chld: [
                'aaa',
                {tag: 'p', attr: {}, chld: ['bar']},
                'bbb',
                {tag: 'p', attr: {}, chld: ['baz']}
            ]
        }
    ) 
})


test('functional component', t => {
    const component = (props, children) => h(
        'div',
        {x: props.x},
        [
            'foo', 
            children,
            'bar',
        ]
    )
    t.deepEqual(
        h(component, {x: 'foo'}, 'xxx', 'yyy'),
        {
            tag: 'div',
            attr: {x: 'foo'},
            chld: ['foo', 'xxx', 'yyy', 'bar']
        }
    )
})
