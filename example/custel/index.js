import './counter-input' //register the custom element 
import {h, define, update} from '../../src'


const view = define(({values}) => (
    <div>
        <p>
            Each counter below is a separate instance of
            the custom element <code>&lt;counter-input&gt;</code>

        </p>
        {values.map((v, i) => (
            <counter-input
                value={v}
                onchange={ev => {
                    values[i] = ev.target.value
                    update(view, {values})
                }}
            />
        ))}
        <p>
            <b>Total:</b>
            {values.reduce((tot, val) => (tot + val), 0)}
        </p>
        <p>
            <button onclick={_ => {
                values.push(3)
                update(view, {values})
            }}>
                Add a Counter
            </button>
        </p>
    </div>
), {values: []})

export {view}