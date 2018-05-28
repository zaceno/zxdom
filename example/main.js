import {h, mount, define, update} from '../src/index.js'


const Navigation = examples => {

    var loadingUrl = false

    const load = url => {
        loadingUrl = url
        update(view, {view: loadingView})
        import(url).then(m => {
            if (loadingUrl != url) return
            console.log(m)
            update(view, {view: m.view})
        })
    }

    const initialView = _ => <p>Select an example</p>
    const loadingView = _ => <p>...Loading...</p>
    const view = define(props => h(props.view), {view: initialView})
    const menu = _ => (
        <ul>
            {examples.map(({url, title}) => (
                <li><a href="#" onclick={_ => load(url)}>{title}</a></li>
            ))}
        </ul>
    )
    return {view, menu}
}

const nav = Navigation([
    {url: './clock.js', title: 'SVG Clock'},
])

document.body.innerHTML='' 
mount(
    <main>
        <nav.menu />
        <hr />
        <nav.view />
    </main>
, document.body)