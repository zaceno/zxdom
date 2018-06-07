import {h, define, update} from '../../src/'

export default function ({onsubmit}) {
    var message = ''
    function setMessage(m) {
        message = m
        update(view)
    }
    function submit() {
        onsubmit(message)
        message = ''
        update(view)
    }
    const view = define(_ => (
        <p>
            Type message:
            <input type="text" onchange={submit} oninput={ev => setMessage(ev.target.value)} value={message}/>
            <button onclick={submit}>Send</button>
        </p>
    ))
    return {view}
}