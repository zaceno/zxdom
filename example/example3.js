import {h, mount, define, update} from '../src/index.js'

const angleOfSixty = x => (x-15)*Math.PI/30
const angleOfTwelve = x => ((x%12)-3) * Math.PI/6

const Clock = define(({sec, min, hour}) => (
    <svg width="300" height="300" viewBox="-1.2 -1.2 2.4 2.4">
        <circle cx="0" cy="0" r="1" fill="#ffffff" stroke="#000000" style="stroke-width: 0.05px;" />
        <line x1="0" y1="0" x2={Math.cos(angleOfSixty(sec))} y2={Math.sin(angleOfSixty(sec))} stroke="#000000" style="stroke-width: 0.01px;" />
        <line x1="0" y1="0" x2={Math.cos(angleOfSixty(min))} y2={Math.sin(angleOfSixty(min))} stroke="#000000" style="stroke-width: 0.05px;" />
        <line x1="0" y1="0" x2={0.6*Math.cos(angleOfTwelve(hour))} y2={0.6*Math.sin(angleOfTwelve(hour))} stroke="#000000" style="stroke-width: 0.05px;" />
    </svg>
), )

const tick = _ => {
    let d = new Date()
    update(Clock, {
        sec: d.getSeconds(),
        min: d.getMinutes(),
        hour: d.getHours(),
    })
}
tick()
setInterval(tick, 1000)

document.body.innerHTML=''
mount((
    <main>
        <h1>Here's a clock:</h1>
        <Clock />
    </main>
), document.body)