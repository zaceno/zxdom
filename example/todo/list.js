import {h, define, update} from '../../src/'
import Item from './item'
import css from './style.css'
import Model from './model'

const ListView = ({items}) => (
    <ul class={css['todo-list']}>
        {items.map(Item => {return (<Item />)})}
    </ul>
)

const ClearButton = ({n, clear}) => (
    <button
        onclick={clear}
        class={css['clear-completed'] + (!n ? (' ' + css.hidden): '')}
    >
        Clear completed
    </button>
)

const Count = ({n}) => (n > 0) ? (
    <span class={css['todo-count']}>
        <strong>{n}&nbsp;</strong>
        items left
    </span>
) : ''


const ListModel = ({ontoggle, onadd}, onupdate) => Model(
    {items: [], filter: x => true},
    {
        clearCompleted: _ => ({items}) => ({
            items: items.filter(i => !i.getDone())
        }),
        remove: item => ({items}) => ({
            items: items.filter(i => i !== item)
        }),
        ontoggle: _ => ontoggle(),
        add: text => ({items}, {remove, ontoggle}) => {
            const item = Item({
                text,
                ontoggle,
                onremove: remove(item)
            })
            onadd()
            return {items: [].concat(item, items)}
        },
        setFilter: filter => ({filter}),
        setAll: x => state => { state.items.forEach(i => i.setDone(x))},
    },
    onupdate
)

export default function ({ontoggle, onadd}) {

    const main = define(ListView)
    const count = define(Count)
    const clear = define(ClearButton)

    const {add, setFilter, setAll} = ListModel({onadd, ontoggle}, (state, actions) => {
        update(main, { items: state.items.filter(state.filter).map(i => i.view) })
        update(count, { n: state.items.filter(i => !i.getDone()).length })
        update(clear, {
            n: state.items.filter(i => i.getDone()).length,
            clear: actions.clearCompleted,
        })
    })

    return {main, count, clear, add, setFilter, setAll}
}

