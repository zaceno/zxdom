import {h, define, update} from '../../src/'

export const view = define(({val}) => (
    <p>
        <button onclick={_ => update(view, {val: val - 1})}>-</button>
        {val}
        <button onclick={_ => update(view, {val: val + 1})}>+</button>
    </p>
), {val: 0})
