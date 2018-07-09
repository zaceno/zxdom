import {h, define, update} from '../../src'
import css from './style.css'
import {Exit, Enter, Move} from './transitions'

const Toast = ({key, clear}, message) => (
    <Exit css={{transform: 'scale(1.5, 1.5)', opacity: '0'}} time={180} easing="ease-in">
        <Enter css={{transform: 'translateX(100%)', opacity: '0'}} time={180} delay={180} easin="ease-out">
            <Move time={180} easing="ease-in-out">
                <div class={css.toast} key={key} onclick={clear}>
                    {message}
                </div>
            </Move>
        </Enter>
    </Exit>
)

const ToastList = ({clearAll, clear, messages}) => (
    <section class={css.toastList}>
        <button onclick={clearAll}>Clear All</button>
        <div>
            {messages.map((m,i) => (
            <Toast key={m.key} clear={_ => clear(i)}>
                {m.text}
            </Toast>
            ))}
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