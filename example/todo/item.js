import {h, define, update} from '../../src/'
import css from './style.css'

const ItemView = ({text, done, toggle, onremove, editing, edit, onsubmit}) => (
    <li
        ondblclick={_ => !editing && edit()}
        class={css.todo + (editing && (' ' + css.editing)) + (done && (' ' + css.complete))}
    >
        <div class="view">
            <input
                type="checkbox"
                class={css.toggle}
                checked={done}
                onclick={toggle}
            />
            <label>{text}</label>
            <button class={css.destroy} onclick={onremove} />
        </div>
        {editing ? <input 
            type="text"
            class={css.edit}
            autofocus={true}
            value={text}
            onchange={ev => onsubmit(ev.target.value)}
            onblur={ev => onsubmit(ev.target.value)}
        /> : null}
    </li>
)

export default function ({text, onremove, ontoggle}) {
    
    var done = false
    var editing = false

    
    function toggle () {
        done = !done
        ontoggle()
        updateView()
    }
    
    function edit () {
        editing = true
        updateView()
    }
    
    function onsubmit (x) {
        text = x
        editing = false
        updateView()
    }

    function getDone () {
        return done
    }
    
    function setDone (x) {
        done = x
        updateView()
    }

    const view = define(ItemView)
    
    function updateView () {
        update(view, { text, done, onremove, editing, toggle, edit, onsubmit })
    }
    
    updateView()

    return {view, getDone, setDone}
}

