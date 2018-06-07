import {h} from '../../src/'
import css from './style.css'
export default function ({onsubmit}) {
    return <input
        class={css['new-todo']}
        type="text"
        placeholder="What needs to get done?"
        onchange={ev => {
            var el = ev.target
            el.value && onsubmit(el.value)
            el.value = ''
        }}
    />
}