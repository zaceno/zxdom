import {h, mount, define, update} from '../src/'
import css from './style.css'

const examples = [
    { url: '#clock',   title: 'SVG Clock',     module: import('./clock') },
    { url: '#counter', title: 'Basic Counter', module: import('./counter')},
    { url: '#todo',    title: 'TodoMVC',       module: import('./todo')},
    { url: '#toast',    title: 'Toasts',       module: import('./toasts')}
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
const CurrentExample = define(({view}) => h(view), {view: InitialView})

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

const Logo = _ => (
    <svg x="0" y="0" width="90" height="85" viewBox="190, 105, 180, 170">
        <g id="Layer_3">
            <path d="M199.5,116.5 C199.5,116.5 200.249,151.857 200.249,151.857 C200.249,151.857 257.981,151.857 257.981,151.857 C257.981,151.857 288.2,176.507 288.2,176.507 C288.2,176.507 327.991,116.5 327.991,116.5 C327.991,116.5 199.5,116.5 199.5,116.5 z" fill-opacity="0" stroke="#ffffff" stroke-width="12" stroke-linejoin="round"/>
            <path d="M265.241,203.783 C265.241,203.783 288.2,176.507 288.2,176.507 C288.2,176.507 257.981,151.857 257.981,151.857 C257.981,151.857 200.249,151.857 200.249,151.857 C200.249,151.857 265.241,203.783 265.241,203.783 z" fill-opacity="0" stroke="#ffffff" stroke-width="12" stroke-linejoin="round"/>
            <path d="M327.991,116.5 C327.991,116.5 358.893,137.405 358.893,137.405 C358.893,137.405 294.001,229.224 294.001,229.224 C294.001,229.224 249.576,229.186 249.576,229.186 C249.576,229.186 327.991,116.5 327.991,116.5 z" fill-opacity="0" stroke="#ffffff" stroke-width="12" stroke-linejoin="round"/>
            <path d="M315.954,199.638 C315.954,199.638 361.798,238.502 361.798,238.502 C361.798,238.502 336.436,265.5 336.436,265.5 C336.436,265.5 293.578,229.175 293.578,229.175 C293.578,229.175 316.462,199.638 315.954,199.638 z" fill-opacity="0" stroke="#ffffff" stroke-width="12" stroke-linejoin="round"/>
            <path d="M710.5,331.5" fill-opacity="0" stroke="#000000" stroke-width="3"/>
            <path d="M235.735,181.854 C235.735,181.854 202.74,228.45 202.74,228.45 C202.74,228.45 202.74,265.5 202.74,265.5 C202.74,265.5 336.436,265.5 336.436,265.5 C336.436,265.5 293.579,229.175 293.579,229.175 C293.579,229.175 249.576,229.186 249.576,229.186 C249.576,229.186 265.241,203.783 265.241,203.783 C265.241,203.783 235.735,181.854 235.735,181.854 z" fill-opacity="0" stroke="#ffffff" stroke-width="12" stroke-linejoin="round"/>
        </g>
    </svg>
)

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