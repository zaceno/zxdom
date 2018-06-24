import {h, mount, define, update} from '../src/'
import css from './style.css'
import Logo from './logo'

const examples = [
    { url: '#clock',   title: 'SVG Clock',       module: import('./clock') },
    { url: '#counter', title: 'Basic Counter',   module: import('./counter')},
    { url: '#todo',    title: 'TodoMVC',         module: import('./todo')},
    { url: '#toast',   title: 'Toasts',          module: import('./toasts')},
    { url: '#select',  title: 'Selectable Grid', module: import('./select')},
    { url: '#form',    title: 'Dynamic form',    module: import('./form')},
    { url: '#custel',  title: 'Custom Elements', module: import('./custel')},
]
const ExampleMenu = _ => (
    <ul>{examples.map(x => (
        <li>
            <a href={x.url}>
                {x.title}
            </a>
        </li>
    ))}</ul>
)
const InitialView =  _ => <p>Select an example</p>
const LoadingView = _ => <p>...Loading...</p>
const CurrentExample = define(({view}) => view.type ? view : h(view), {view: InitialView})

function onHashChange () {
    const hash = window.location.hash
    const example = examples.reduce((y, x) => (y || (x.url === hash && x)), false)
    if (example) {
        update(CurrentExample, {view: LoadingView})
        example.module.then(({view}) => update(CurrentExample, {view}))
    } else {
        update(CurrentExample, {view: InitialView})
    }
}
window.addEventListener('hashchange', onHashChange)
onHashChange()

mount(
    <main class={css.layout}>
        <div class={css.left}>
            <Logo />
            <ExampleMenu />
        </div>
        <div class={css.right}>
            <CurrentExample />
        </div>
    </main>
, document.body)