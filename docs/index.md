---
layout: page
---

# ZXDOM

ZXDOM is a lightweight, minimalistic javascript library to help you create and modify DOM Elements in your web-pages. Use it for dynamic widgets in your web-pages, shareable WebComponents, or even full-blown single-page-applications. 

Here's a simple example of how to create and mount a "counter" (the "Hello World" of web-frameworks):

<runnable-example><pre><code class="lang-js">
const Counter = define(
    data => h('p', {}, [
        h('button', {onclick: _ => update(Counter, {value: data.value - 1})}, '-'),
        data.value,
        h('button', {onclick: _ => update(Counter, {value: data.value + 1})}, '+'),
    ]),
    {value: 0}
)

mount(Counter, document.querySelector('#example-counter'))
</code></pre></runnable-example>

Click the `Run` button above to see the result below:

<div id="example-counter"></div>

Let's unpack what's going on in that example. First -- getting set up to start toying with ZXDOM is incredibly simple and refreshingly back to basics if you're used to lots of setup and configuration to begin a new project.

Simply start with a blank new html page:

```html
<!doctype html>
<html>
    <head>
        <script src="https://unpkg.com/zxdom"></script>
        <script defer>
            const {h, mount, define, update, make, patch} = zxdom
            // - Or just use zxdom.h et c as you prefer
            /*
                Your code goes here.
            */
        </script>
    </head>
    <body>
        <!---   Whatever html you want to
                write statically.  -->
    </body>
</html>
```

If you're using a build tool such as [parcel](http://parceljs.org), you can install ZXDOM from npm:

```
npm -i zxdom
```

and then use as you normally would in your scripts:

```js
import {h, mount, define, update, make, patch} from 'zxdom'
//- those are all the functions zxdom exports. You probably don't need all of them all the time!

```

With that, you should be able to follow along with, and play with your own versions of, the examples below.

## `make(<virtual-node>)`

ZXDOM is a virtual-dom engine. It means that you tell it what you'd like the DOM to look like, and it will make the actual DOM match your intention, as efficiently as it can. You tell ZXDOM how you want the DOM to be your intended result with a "virtual node" -- a javascript object that describes a dom node and its children (hence "virtual")

A simple virtual dom node might look like this:

```js
{
    type: 'h1',
    attributes: {
        style: 'color: blue;'
    },
    children: [
        'Hello',
        {
            type: 'span',
            attributes: {
                style: 'font-style: italic;'
            },
            children: [
                'World!'
            ]
        }
    ]
}
```

What `make` does, is to take a virtual node, and transform it into a plain HTMLElement, so you can insert it where you like in the actual page:

<runnable-example><pre><code class="lang-js">
document.querySelector('#example-make').appendChild(
    make({
        type: 'h1',
        attributes: {
            style: 'color: blue;'
        },
        children: [
            'Hello',
            {
                type: 'span',
                attributes: {
                    style: 'font-style: italic;'
                },
                children: [
                    'World!'
                ]
            }
        ]
    })
)
</code></pre></runnable-example>

<div id="example-make"></div>

## `h(type, attributes, ...children)`

Actually, don't write virtual nodes out like I did in those examples above. That's a lot to write, and I might change the spec in the future. Instead, use the helper `h` to generate virtual nodes.

The same example above can be written as: 

<runnable-example><pre><code class="lang-js">
document.querySelector('#example-h').appendChild(
    make(
        h('h1', { style: 'color: blue;'}, [
            'Hello',
            h('span', {style: 'font-style: italic;'}, 'World')
        ])
    )
)
</code></pre></runnable-example>

<div id="example-h"></div>

... much nicer, right?  And a bit closer to how your html would look. (In fact, `h` is compatible with `JSX` if you'd like to declare your DOM in a way that *really* looks like html (almost))

## `mount(virtualnode, container)`

Since making an element and then appending it to a container (like we've been doing so far) is so common, there's `mount` which does it all in one fell swoop.

<runnable-example><pre><code class="lang-js">
mount(
    h('h1', { style: 'color: blue;'}, [
        'Hello',
        h('span', {style: 'font-style: italic;'}, 'World')
    ]),
    document.querySelector('#example-mount')
)
</code></pre></runnable-example>

<div id="example-mount"></div>

(Also, mount replaces all of what was already in the container with the new element. You'll notice that if you click the "run" button above multiple times. If that's not what you want, stick with `make` and `appendChild`)

Like `make`, `mount` returns the element created.

## `patch(element, oldnvode, newvnode)`

With `h`, `make` and `mount`, we have some nice tools for easily generating a bunch of DOM elements and putting them on a page. But that's only half the story. What about when we want to *change* something? – `patch` has you covered.

`patch` takes three arguments:
- the element, which you previously created with `make` or `mount`)
- the old virtual node, representing the current shape of the DOM from the element and down
- the new virtual node, representing how you want it to look *now*

Typically when changing a part of the dom, only a few things here and there need to change. Change an attribute, add or remove a class to an element, change some text, add or remove a child node somewhere, et c. Finding and modifying those things using the DOM APIs can be quite a chore. What patch does, is it compares the old and new virtual nodes, and figures out what things to change, and does it for you – as efficiently as it can. 

In this example, we alternate the middle child in the list back and forth, using patch:

<runnable-example><pre><code class="lang-js">

function ColorList ({colors}) {
    return h('ul', {}, colors.map(c => 
        h('li', {style: `color: ${c};`}, c)
    ))
}

var current = ColorList({colors: ['black', 'green', 'orange']})
var next = ColorList({colors: ['black', 'pink', 'orange']})
var el = mount(current, document.querySelector('#example-patch'))

setInterval(_ => {
    el = patch(el, current, next)
    let tmp = current
    current = next
    next = tmp
}, 1000)
</code></pre></runnable-example>

<div id="example-patch"></div>

Notice that patch returns the element. In this case it will be the same element, because only it's children are changing, but theoretically you could change it to a completely different element. Patch returns the new element so you can keep track of it for future patches.


## Widgets

Typically, the only logic you care about is how your data get transformed into a vnode. Like how an array of strings turns into a virtual node for a colorful list in the example above.

Keep track of the previous node and element at all times can easily be abstracted away, so ZXDOM can do that for you, through "widgets".

Use `define(f, data)` to define a widget. The first parameter `f` is a function that is given some data in the form of an objet, and should return a virtual node. The widget returned by `define` can be used instead of a virtual-node in `make` or `mount` (but not in `patch`!). When you do that, a virtual node is generated by passing the data (second argument) to the function (first argument), and from tha virtual node, an element is generated (and mounted, if using `mount`)

When you have new data for the widget, call `update(widget, newdata)`. This will generate a new virtual node from the function you gave to `define`, and the new data given here in the second argument. And patch will be called.

<runnable-example><pre><code class="lang-js">
const greeting = define(
    data => h('p', {}, ['Hello ', data.name, '!']),
    {name: 'Beth'}
)

setTimeout(_ => update(greeting, {name: 'Jane'}), 1000)

mount(greeting, document.querySelector('#example-widget'))
</code></pre></runnable-example>

<div id="example-widget"></div>

And that's about it. Now you know enough about ZXDOM to understand how the Counter example I showed at the beginning works. 
...and actually that's pretty much all you need to know! There are still some quite useful details in the API specs, so check them out next (just skim them unless you're a completist). Then clone the repository and run the examples `npm run demo`, while perusing the source in the `examples` folder. That should give you plenty of ideas of how to build something really cool with ZXDOM.