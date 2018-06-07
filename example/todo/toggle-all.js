import {h, define, update} from '../../src/'
import css from './style.css'

const AllDoneCheckbox = ({checked, onclick}) => (
    <input
        alt="Mark all as complete"
        type="checkbox"
        class={css['toggle-all']}
        checked={checked}
        onclick={onclick}
    />
)

export default function ({ontoggle}) {
    var checked = false

    function onclick () {
        checked = !checked
        ontoggle(checked)
        updateView()
    }
    
    function uncheck () {
        checked = false
        updateView()
    }
    
    const view = define(AllDoneCheckbox)

    function updateView () {
        update(view, {checked, onclick})
    }
    
    updateView()
    
    return {view, uncheck}
}

