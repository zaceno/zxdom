import {h, mount, define, update} from '../../src'

class CounterInput extends HTMLElement {
    constructor() {
        super();
        this._value = 0
        this._view = define(_ => (
            <p>
                <button onclick={_ => this.decrement()}>-</button>
                {this.value}
                <button onclick={_ => this.increment()}>+</button>
            </p>
        ))
        mount(this._view, this.attachShadow({mode: 'open'}))
    }
    increment () { this.value++ }
    decrement () { this.value-- }
    get value () { return this._value }
    set value (x) {
        if (this._value === x) return
        this._value = x
        update(this._view)
        this.dispatchEvent(new Event('change'))
    }
 }
 customElements.define('counter-input', CounterInput);
 
