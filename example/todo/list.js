import {h, define, update} from '../../src/'
import Item from './item'
import css from './style.css'

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

export default function ({ontoggle, onadd}) {

    var items = []
    var filter = x => true

    function clearCompleted () {
        items = items.filter(i => !i.getDone())
        updateViews()
    }
    
    function onItemToggle () {
        ontoggle()
        updateViews()
    }
    
    function remove (item) {
        items.splice(items.indexOf(item), 1)
        updateViews()
    }
    
    function add (text) {
        const item = Item({
            text,
            ontoggle: onItemToggle,
            onremove () { remove(item)},
        })
        items.unshift(item)
        onadd()
        updateViews()
    }

    function setFilter (f) {
        filter = f
        updateViews()
    }

    function setAll (x) {
        items.forEach(i => i.setDone(x))
        updateViews()
    }

    const main = define(ListView)
    const count = define(Count)
    const clear = define(ClearButton)
    
    function updateViews () {
        update(main, { items: items.filter(filter).map(i => i.view) })
        update(count, { n: items.filter(i => !i.getDone()).length })
        update(clear, {
            n: items.filter(i => i.getDone()).length,
            clear: clearCompleted,
        })
    }
    updateViews()
    
    return {main, count, clear, add, setFilter, setAll}
}

