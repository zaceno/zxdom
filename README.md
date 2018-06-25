
# <img height="26" src="https://cdn.rawgit.com/zaceno/f96607fd718c42bd912bb161834ecb5e/raw/2cd75c3fbf62b4e2afef81739dc1b481b52e73b5/logo.svg"> ZXDOM

A minimalistic, lightweight library for managing your DOM, based on the "virtual-DOM" idea. Use it to manage dynamic widgets in your static web-pages, to make WebComponents, or even full blown single-page-application.

## An example

The prototypical counter example with ZXDOM looks like:

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

(the example uses JSX for readability, but it is not required. You can just as easily use the built in `h` function which the JSX compiles to)

## Docs

The [docs](https://zaceno.github.io/zxdom) are very rudimentary at the moment. They do unpack the counter example with a summary walk-through of the functions exported by ZXDOM.

(Caveat: The docs only work with Chrome and Safari at the moment, because I got ahead of myself using the v1 spec of custom elements to implement the example-runner)

## More examples/demos:

While the docs are brief at the moment, the `example` folder has more demos of what is possible, and how.

To run them:

```
$> git clone https://github.com/zaceno/zxdom

$> cd zxdom

$> npm install

$> npm run demo
```

...then go to http://localhost:1234

## Browser support

Currently: Chrome, Firefox and Safari. Not IE. Probably Edge but I haven't tested.

## Why?
It may look similar to any of the numerous other React-ish frameworks/view-layers out there. But it *is* different (afaik).

I designed it to be minimal, not only in terms of footprint, but in adding *artificial complexity*. I'm trying to provide a view layer that allows you to use whatever strategies you like for architecture, modularization and state-management – with *minimal boilerplate, glue-code & bookkeeping*

## Acknowledgement

Heavily inspired by [Hyperapp](https://github.com/hyperapp/hyperapp). – Which you should totally look into if you want something still minimal, but more frameworkish.
