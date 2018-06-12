import SelectionManager from './select'
import {h, define, update} from '../../src'
import css from './style.css'

export default function () {
    const sel = SelectionManager({onchange: _ => update(view)})
    var grid = [...Array(20).keys()].map(i => [...Array(20).keys()].map(j => ' '))
    function setChar(char) {
        grid = sel.mapSelection(grid, _ => char)
        sel.reset()
    }
    const view = define(_ => (
        <table class={css.grid}>
            {grid.map((rowvals, row) => (
            <tr>
                {rowvals.map((val, col) => (
                    <sel.decorator row={row} col={col}>
                        <td>{val}</td>
                    </sel.decorator>
                ))}
            </tr>
            ))}
        </table>
    ))
    return {view, setChar}
}