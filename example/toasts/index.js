import {h, define} from '../../src/'
import Writer from './writer'

const writer = Writer({onsubmit: message => console.log('MSG', message)})

const view = define(_ => (
    <section>
        <h3>under construction dawg</h3>
        <writer.view />
    </section>
))
export {view}