import './counter-input' //register the custom element 
import './runnable-example'
import {h, define, update} from '../../src'



const view = define(({values}) => (
    <div>
        <p>
            Each counter below is a separate instance of
            the custom element <code>&lt;counter-input&gt;</code>

        </p>
        {values.map((v, i) => (
            <counter-input
                value={v}
                onchange={ev => {
                    values[i] = ev.target.value
                    update(view, {values})
                }}
            />
        ))}
        <p>
            <b>Total:</b>
            {values.reduce((tot, val) => (tot + val), 0)}
        </p>
        <p>
            <button onclick={_ => {
                values.push(3)
                update(view, {values})
            }}>
                Add a Counter
            </button>
        </p>
        <h2>Runnable Code examples</h2>
        <runnable-example>{`
            mount(
                h('h1', {}, 'Hello World!'),
                document.querySelector('#example-helloworld')
            )
        `}</runnable-example>
        <div id="example-helloworld">Hello world Example will run here</div>
        <hr />

        <runnable-example>{`
const angleOfSixty = x => (x-15)*Math.PI/30
const angleOfTwelve = x => ((x%12)-3) * Math.PI/6

const view = define(({sec, min, hour}) => h('svg', {width: "300", height: "300", viewBox:"-1.2 -1.2 2.4 2.4"}, [
    h('circle', {cx:"0", cy:"0", r:"1", fill:"#ffffff", stroke:"#000000", style:"stroke-width: 0.05px;"}),
    h('line', {x1:"0", y1:"0", x2: Math.cos(angleOfSixty(sec)), y2: Math.sin(angleOfSixty(sec)), stroke:"#000000", style: "stroke-width: 0.01px;"}),
    h('line', {x1:"0", y1:"0", x2: Math.cos(angleOfSixty(min)), y2: Math.sin(angleOfSixty(min)), stroke:"#000000", style: "stroke-width: 0.05px;"}),
    h('line', {x1:"0", y1:"0", x2: 0.6*Math.cos(angleOfTwelve(hour)), y2: 0.6*Math.sin(angleOfTwelve(hour)), stroke: "#000000", style: "stroke-width: 0.05px;"}),
]))

const tick = _ => {
    let d = new Date()
    update(view, {
        sec: d.getSeconds(),
        min: d.getMinutes(),
        hour: d.getHours(),
    })
}
setInterval(tick, 1000)
tick()

mount(view, document.querySelector('#example-clock'))

        `}</runnable-example>
        <div id="example-clock">Clock example will run here</div>
    </div>
), {values: []})

export {view}