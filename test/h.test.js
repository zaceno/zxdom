import test from 'ava'
import {define, h} from '../dist/zxdom'

test('basic tag', t => {
    t.deepEqual(h('div'), {type: 'div', attributes: {}, children: []})    
})
test('tag with props', t => {
    t.deepEqual(
        h('div', {id: 'foo'}),
        {type: 'div', attributes: {id: 'foo'}, children: []}
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
            type: 'div',
            attributes: {id: 'foo'},
            children: [
                'aaa',
                {type: 'p', attributes: {}, children: ['bar']},
                'bbb',
                {type: 'p', attributes: {}, children: ['baz']}
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
            type: 'div',
            attributes: {x: 'foo'},
            children: ['foo', 'xxx', 'yyy', 'bar']
        }
    )
})
