import {h, define, update} from '../../src'
import css from './style.css'


const ToastList = ({clearAll, clear, messages}) => (
    <section class={css.toastList}>
        <button onclick={clearAll}>Clear All</button>
        <div>
            <zx-transition name="toast">
            {messages.map((m,i) => (
            <div class={css.toast} key={m.key} onclick={_ => clear(i)}>
                {m.text}
            </div>
            ))}
            </zx-transition>
        </div>
    </section>
)

export default function () {

    var messages = []

    function clearAll() {
        messages = []
        update(view)
    }

    function clearMessage (index) {
        messages.splice(index, 1)
        update(view)
    }

    function addMessage(text) {
        messages.unshift({
            text,
            key: 'id' + (new Date().getTime())
        })
        update(view)
    }

    const view = define(_ => h(ToastList, {
        clearAll,
        clear: clearMessage,
        messages
    }))
    
    return {view, addMessage}
}