import {h, define} from '../../src'
import Chart from 'chart.js'

var chart
const options = ['Yes', 'Sometimes', 'No']
const votes = [0,0,0]

const view = define(_ => (
    <div>
        <h1>A Poll</h1>
        <p><i>Do you like polls?</i></p>
        <p>
            {options.map((opt, index) => (
                <button onclick={_ => {
                    votes[index]++
                    chart.data.datasets[0].data = votes
                    chart.update()                
                }}>
                    {opt}
                </button>
            ))}
        </p>
        <canvas
            key="chart"
            oncreate={el => {
                chart = new Chart(el, {
                    type: 'bar',
                    data: {
                        labels: options,
                        datasets: [{
                            label: "Votes",
                            data: votes,
                            backgroundColor: ['green', 'yellow', 'red']
                        }]
                    },
                    options: {
                        responsive: false,
                        scales: { yAxes: [{ ticks: { beginAtZero:true } }] }
                    }
                })
            }}
            onremove={_ => { chart = null }}
            style="width: 400px; height: 200px;"
        />
    </div>
))

export {view}