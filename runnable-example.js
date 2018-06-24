import {h, mount, define, update, make, patch} from './src/index.js'
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
        shadow.appendChild(make(
            h('style', {}, `
                .example {
                    border: 1px black solid;
                }
                .code {
                    border-bottom: 1px black solid;
                }
            `)
        ))
        shadow.appendChild(make(
            h('div', {class: 'example'}, [
                h('div', {class: 'code'}, [this._code]),
                h('button', {onclick: _ => this.runCode()}, 'Run')
            ])
        ))
    }
}

customElements.define('runnable-example', RunnableExample)