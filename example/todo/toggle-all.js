import {h, define, update} from '../../src/'
import css from './style.css'
import Model from './model'

export default function ({ontoggle}) {
    const view = define(({checked, onclick}) => (
        <input
            alt="Mark all as complete"
            type="checkbox"
            class={css['toggle-all']}
            checked={checked}
            onclick={onclick}
        />
    ))
    const {uncheck} = Model(
        {
            checked: false
        },
        {
            onclick: _ => s => {
                const checked = !s.checked
                ontoggle(checked)
                return {checked}
            },
            uncheck: _ => ({checked: false})
        },
        (s, a) => update(view, {
            checked: s.checked,
            onclick: a.onclick
        })
    )
    return {view, uncheck}
}

