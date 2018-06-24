---
layout: page
---

# ZXDOM

ZXDOM is a lightweight, minimalistic javascript library to help you create and modify DOM Elements in your web-pages. Use it for dynamic widgets in your web-pages, shareable WebComponents, or even full-blown single-page-applications. 

Here's a simple example of how to create and mount a counter:

<runnable-example><pre><code class="lang-js">
const Counter = define(({value}) => h('p', {}, [
    h('button', {onclick: _ => update(Counter, {value: value - 1})}, '-'),
    value,
    h('button', {onclick: _ => update(Counter, {value: value + 1})}, '+'),
]))

mount(Counter, document.querySelector('#example-counter'))
</code></pre></runnable-example>

Click the `Run` button above to see the result below:

<div id="example-counter"></div>


You use the `h` function to generate a virtual dom tree: a representation of what you'd like the DOM to look like.

```js
h('div', {style: 'border: 1px red solid;'}, [
    h('p', {}, 'Hello world'),
    h('button', {onclick: _ => alert('hi!')}, 'Push me')
])
```

Generates a virtual node which basically looks like this:

```js
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

In order to turn *virtual* dom nodes into *real* dome nodes, use the `make` function. `make` turns a virtual node such as the above into a dom element equivalent to what this HTML would produce:

```html
<div style="border: 1px red solid;">
    <p>Hello world</p>
    <button onclick="_ => alert('hi')">Push me</button>
</div>
```

The resulting element can then be mounted somewhere in the real dom:


<runnable-example><pre><code class="lang-js">
document.querySelector('#example-make').appendChild(
    make(
        h('div', {style: 'border: 1px red solid;'}, [
            h('p', {}, 'Hello world'),
            h('button', {onclick: _ => alert('hi!')}, 'Push me')
        ])
    )
)
</code></pre></runnable-example>

Example will show here when run:
<div id="example-make"></div>

