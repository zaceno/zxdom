import {h, define, update} from '../../src/'
import css from './style.css'
import Model from './model'

const ItemView = ({text, done, toggle, onremove, editing, edit, onsubmit}) => (
    <li
        ondblclick={_ => !editing && edit()}
        class={[
            editing && css.editing,
            done && css.complete
        ].filter(c => c).join(' ')}
    >
        <div class={css.view}>
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

const ItemModel = ({text, ontoggle}, onupdate) => Model(
    {
        text,
        done: false,
        editing: false,
    },

    {
        toggle: _ => state => {
            let done = !state.done
            ontoggle(done)
            return {done}
        },
        edit: _ => ({editing: true}),
        submit: text => ({text, editing: false}),
        setDone: x => ({done: x})
    },
    
    onupdate
)

export default function ({text, onremove, ontoggle}) {
    var view = define(ItemView)
    var done = false
    function getDone() {return done}
    const {setDone} = ItemModel(
        {
            text,
            ontoggle: done2 => {
                done = done2
                ontoggle()
            }
        },
        (state, actions) => {
            done = state.done
            update(view, {
                text: state.text,
                done: state.done,
                toggle: actions.toggle,
                onremove,
                editing: state.editing,
                edit: actions.edit,
                onsubmit: actions.submit,
            })
        }
    ) 

    return {view, getDone, setDone}
}



