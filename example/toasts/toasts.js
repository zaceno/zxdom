import {h, define, update} from '../../src'
import css from './style.css'

function slideIn (el) {
    el.style.transform = 'translateX(100%)'
    el.style.opacity = '0'
    el.style.transition = 'all ease-in-out 400ms'
    requestAnimationFrame(_ => {
        el.style.transform = null
        el.style.opacity = null
        setTimeout(_ => {
            el.style.transition = null
        }, 400)
    })
}

function popOut (el) {
    el.style.transition = 'all ease-in-out 400ms'
    requestAnimationFrame(_ => {
        el.style.transform = 'scale(2.0, 2.0)'
        el.style.opacity = '0.0'
        setTimeout(_ => {
            el.parentNode.removeChild(el)
        }, 400)
    })
    return true
}


const Toast = ({key, clear}, message) => (
    <div oncreate={slideIn} onremove={popOut} class={css.toast} key={key} onclick={clear}>
        {message}
    </div>
)

const ToastList = ({clearAll, clear, messages}) => (
    <section class={css.toastList}>
        <button onclick={clearAll}>Clear All</button>
        {messages.map((m, i) => (
            <Toast key={m.key} clear={_ => clear(i)}>
                {m.text}
            </Toast>
        ))}
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