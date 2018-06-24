import {h, mount, define, update, make, patch} from './src/index.js'

class RunnableExample extends HTMLElement {
    runCode () {
        const code = this.textContent
        Function(
            'h', 'mount', 'define', 'update', 'make', 'patch',
            code
        )(h, mount, define, update, make, patch)
    }
    connectedCallback () {
        //to let the syntax highlighter do its work first
        setTimeout(_ => {
            const shadow = this.attachShadow({mode: 'open'})
            shadow.appendChild(make(
                h('style', {}, `
                    @import url('./assets/prism.css');
                    .runnable {
                        border: 1px black solid;
                    }
                    .code {
                        border-bottom: 1px black solid;
                    }
                `)
            ))
            shadow.appendChild(make(
                h('div', {class: 'runnable',}, [
                    h('div', {
                        class: 'code',
                        oncreate: el => el.innerHTML = this.innerHTML
                    }),
                    h('button', {onclick: _ => this.runCode()}, 'Run')
                ])
            ))
        }, 0)
    }
}

customElements.define('runnable-example', RunnableExample)