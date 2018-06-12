import css from './style.css'
export default function ({onchange}) {

    var selection = {
        selecting: false,
        active: false,
        rowStart: 0,
        colStart: 0,
        rowEnd: 0,
        colEnd: 0,
    }

    function inSelection(row, col) {
        if (!selection.active) return false
        const {rowStart: rs, rowEnd: re, colStart: cs, colEnd: ce} = selection
        const [rf, rt] = rs <= re ? [rs, re] : [re, rs]
        const [cf, ct] = cs <= ce ? [cs, ce] : [ce, cs]
        return row >= rf && row <= rt && col >= cf && col <= ct
    }
    
    function mapSelection (grid, fn) {
        return grid.map((rowvals, row) =>
            rowvals.map((val, col) =>
                inSelection(row, col) ? fn(val, row, col) : val
            )
        )
    }

    function reset() {
        selection.active = false;
        onchange()
    }

    const decorator = ({row, col}, children) => {
        const attr = children[0].attributes
        attr.onupdate = el => {
            if (inSelection(row, col)) el.classList.add(css.selected)
            else el.classList.remove(css.selected)
        }
        attr.onmousedown = ev => {
            ev.preventDefault(ev)
            selection = {
                selecting: true,
                active: true,
                rowStart: row,
                rowEnd: row,
                colStart: col,
                colEnd: col,
            }    
            onchange()
        }
        attr.onmouseover = ev => {
            ev.preventDefault(true) 
            if (!selection.selecting) return
            selection.rowEnd = row
            selection.colEnd = col
            onchange()
        }
        attr.onmouseup = ev => {
            ev.preventDefault(true)
            selection.selecting = false
            onchange()
        }
        return children[0]
    }

    return {decorator, mapSelection, reset}
}