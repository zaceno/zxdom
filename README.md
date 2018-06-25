# zxdom

A minimalistic, lightweight library for managing your DOM, based on the concept of virtual-DOM idea. Use it to manage dynamic widgets in your static web-pages, to make WebComponents, or even full blown single-page-application.

## An example

The prototypical counter example with ZXDOM looks like this:

```jsx
import {h, define, mount, update} from 'zxdom'

const Counter = define(
  data => (
    <p>
      <button onclick={_ => update(Counter, {value: data.value - 1})}>-</button>
      {data.value}
      <button onclick={_ => update(Counter, {value: data.value + 1})}>+</button>
    </p>
  ),
  {value: 0}
)

mount(Counter, document.body)
```

(the example uses JSX for readability, but it is not required. You can just as easily use the built in `h` function which the JSX should compile to)

## Docs

The [docs](https://zaceno.github.io/zxdom) are very rudimentary at the moment, but unpack the coutner example with a summary walk-through of the functions exported by ZXDOM.

(Caveat: The docs only work with chrome and safari at the moment, because I got ahead of myself using the v1 spec of custom elements to implement the example-runner)

## More examples/demos:

The docs are brief at the moment, but the `example` folder has more demos of what is possible and how. To run them:

```
$> git clone https://github.com/zaceno/zxdom

$> cd zxdom

$> npm install

$> npm run demo
```

## Browser support

Currently: Chrome, Firefox and Safari. Not IE. Probably Edge but I haven't tested.

## Why?
At first glance it may look like any of the other React-ish frameworks/view-layers out there. Why does the world need yet another one of these, you ask? – It may not look that different from other virtual-dom engines but it is (at least as far as I know).

## Acknowledgement

Heavily inspired by [Hyperapp](https://github.com/hyperapp/hyperapp). – Which you should totally check out if you're looking for something more frameworkish.
