import {h, define, update} from '../../src/'
import css from './style.css'
import Model from './model'

const FILTERS = {
    all:        i => true,
    completed:  i => i.getDone(),
    active:     i => !i.getDone(),
}

export default function ({onchange}) {
    const view = define(({current, onselect}) => {
        const FilterButton = ({name}, children) => (
            <span
                class={css['filter-button'] + (name === current && (' ' + css.selected ))}
                onclick={_ => onselect(name)}
            >
                {children}
            </span>
        )    
        return (
            <ul class={css.filters}>
                <li><FilterButton name="all">All</FilterButton></li>
                <li><FilterButton name="completed">Completed</FilterButton></li>
                <li><FilterButton name="active">Active</FilterButton></li>
            </ul>
        )
    })
    Model(
        {current: 'all'},
        {onselect: current => {
            onchange(FILTERS[current])
            return {current}
        }},
        (state, actions) => update(view, {
            current: state.current,
            onselect: actions.onselect
        })
    )
    return {view}
}
