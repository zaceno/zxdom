import {h} from '../../src/'
import List from './list'
import Toggle from './toggle-all'
import Entry from './entry'
import Filters from './filters'
import css from './style.css'

const toggle = Toggle({ontoggle: x => list.setAll(x) })
const filters = Filters({onchange: f => list.setFilter(f) })
const list = List({
    ontoggle: _ => toggle.uncheck(),
    onadd: _ => toggle.uncheck()
})

export const view = _ => (
    <section class={css.todoapp}>
        <header class={css.header}>
            <h1>todos</h1>
            <Entry onsubmit={x => list.add(x)} />
        </header>
        <section class={css.main}>
            <toggle.view />
            <list.main />
        </section>
        <footer class={css.footer}>
            <list.clear />
            <filters.view />
            <list.count />
        </footer>
    </section>
)