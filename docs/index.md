---
layout: page
---

You use the `h` function to generate a virtual dom tree: a representation of what you'd like the DOM to look like.

```
h('div', {style: 'border: 1px red solid;'}, [
    h('p', {}, 'Hello world'),
    h('button', {onclick: _ => alert('hi!')}, 'Push me')
])
```

Generates a virtual node which basically looks like this:

```
{
    type: 'div',
    attributes: {
        style: 'border: 1px red solid;'
    },
    children: [
        {
            type: 'p',
            attributes: {},
            children: [
                'Hello world'
            ]
        },
        {
            type: 'button',
            attributes: {
                onclick: _ => alert('hi!')
            },
            children: [
                'Push me'
            ]
        }
    ]
}
```

In order to turn *virtual* dom nodes into *real* dome nodes, use the `make` function. The resulting element can then be mounted 
somewhere in the real dom:


<runnable-example>
```
const virtualNode = h('div', {style: 'border: 1px red solid;'}, [
    h('p', {}, 'Hello world'),
    h('button', {onclick: _ => alert('hi!')}, 'Push me')
])

const elem = make(virtualNode)

document.querySelector('#example-make').appendChild(elem)
```
</runnable-example>


<div id="example-make">
        Example will show here when run
</div>

