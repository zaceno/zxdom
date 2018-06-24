import {h, mount, define, update, make, patch} from '../../src'

const STYLE = `
.example {
    border: 1px black solid;
}
.code {
    border-bottom: 1px black solid;
}

`

class RunnableExample extends HTMLElement {
    runCode () {
        const code = this._code
        Function(
            'h', 'mount', 'define', 'update', 'make', 'patch',
            code
        )(h, mount, define, update, make, patch)
    }
    connectedCallback () {
        this._code = this.textContent
        const shadow = this.attachShadow({mode: 'open'})
        shadow.appendChild(make(<style>{STYLE}</style>))
        shadow.appendChild(make(
            <div class="example">
                <div class="code">
                    <pre>
                        {this._code}
                    </pre>
                </div>
                <button onclick={_ => this.runCode()}>Run</button>
            </div>
        ))
    }
}

customElements.define('runnable-example', RunnableExample)