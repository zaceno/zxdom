import {h} from '../../src'
import Grid from './grid'

const grid = Grid()

export const view = _ => (
    <section>
        <p>
            Click and drag in the grid, then click one of the 
            buttons to set the character in your selection.
        </p>
        <button onclick={_ => grid.setChar('X')}>Set X</button>
        <button onclick={_ => grid.setChar('O')}>Set O</button>
        <button onclick={_ => grid.setChar('.')}>Set .</button>
        <button onclick={_ => grid.setChar(' ')}>Clear</button>
        <grid.view />
    </section>
)


