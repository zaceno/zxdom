import './zx-transition'
import {h, define} from '../../src/'
import Writer from './writer'
import Reciever from './toasts'

const reciever = Reciever()
const writer = Writer({onsubmit: reciever.addMessage})

const view = define(_ => (
    <section>
        <writer.view />
        <reciever.view />
    </section>
))
export {view}