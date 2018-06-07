import {h, define} from '../../src/'
import Writer from './writer'
import Reciever from './toasts'

const reciever = Reciever()
const writer = Writer({onsubmit: reciever.addMessage})

const view = define(_ => (
    <section>
        <h3>under construction dawg</h3>
        <writer.view />
        <reciever.view />
    </section>
))
export {view}