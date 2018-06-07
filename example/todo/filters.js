import {h, define, update} from '../../src/'
import css from './style.css'

const FiltersView = ({current, onselect}) => {
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
}

export default function ({onchange}) {
    const FILTERS = {
        all:        i => true,
        completed:  i => i.getDone(),
        active:     i => !i.getDone(),
    }

    function onselect (name) {
        onchange(FILTERS[name])
        update(view, {current: name, onselect})
    }
    
    const view = define(FiltersView, {current: 'all', onselect})
    
    return {view}
}