import {h, mount, define, update} from '../src/index.js'

const Mach2 = ({state, callback, defs}) => {
    var __callback = _ => {}
    const _callback = _ => __callback()
    const wirer = function (f) {
        return function (...args) {
            const ret = f(state, ...args)
            if (typeof ret !== 'undefined') state = ret
            _callback()
        }
    }
    const d = defs(wirer)
    if (callback) __callback = _ => callback(state, d)
    __callback()
    return d
}

const Deleter = ({ondelete}) => Mach2({
    state: {on: false},
    callback: (state, {button}) => update(button, state),
    defs: $ => ({
        on: $(state => {state.on = true}),
        off: $(state => {state.on = false}),
        button: define(state => state.on ? <button onclick={ondelete}>X</button> : '')    
    })
})

const Editor = ({setText}) => Mach2({
    state: {on: false},
    callback: (state, {show}) => update(show, state),
    defs: $ => {
        const start = $(_ => ({on:true}))
        const set = $((s, text) => {
            setText(text)
            s.on = false
        })
        const show = define(props => (props.on ? <input type="text" value={props.text} autofocus={true} onchange={ev => set(ev.target.value)} /> : h(props.or)))
        return {start, show}    
    }
})

const TodoItem = ({text, ondelete, ontoggle}) => Mach2({
    state: {text, done: false},
    callback: (state, defs) => update(defs.view, state),
    defs: $ => {
        const deleter = Deleter({ondelete})
        const editor = Editor({ setText: $((s, text) => {s.text = text}) })
        const toggleDone = $(state => {
            state.done = !state.done
            ontoggle(state.done)
        })
        const setDone = $((state, x) => {state.done = x})
        const view = define(state => (
            <li onmouseover={deleter.on} onmouseleave={deleter.off}>
                <editor.show text={state.text} or={_ => (
                    <x->
                        <input type="checkbox" onclick={toggleDone} checked={state.done} />
                        <span onclick={_ => editor.start()} style={state.done ? ' text-decoration: line-through; opacity: 0.5;' : ''}>{state.text}</span>
                        <deleter.button />
                    </x->
                )}/>
            </li>
        ))

        return {setDone, view}
    },
})

const NewTodoInput = define(({value, onsubmit}) => (
    <input
        placeholder="What needs to get done"
        value={value}
        onchange={ev => {
            onsubmit(ev.target.value)
            update(NewTodoInput, {value: ''})
        }}
    />
), {value: ''})

const mainView = Mach2({
    state: {
        todos: [],
        filter: 'all',
        allToggle: false,
    },
    callback: (state, view) => update(view, state),
    defs: $ => {

        const addTodo = $((state, text) => {
            const newTodo = TodoItem({
                text,
                ondelete: $(({todos}) => todos.splice(todos.indexOf(newTodo), 1)),
                ontoggle: x => {
                    newTodo.done = x
                    resetAllToggle()
                }
            })
            newTodo.done = false
            state.todos.push(newTodo)
            resetAllToggle()
        })

        const setFilter = $(x => {state.filter = x})

        const clearCompleted = $(state => {state.todos = state.todos.filter(t => !t.done)})


    }
})




const ItemsLeft = _ => {
    const n = todos.filter(todo => !todo.done).length
    return n ? `Items left: ${n}` : ''
}





const TodoList = _ => (

)

var allToggle = false
const resetAllToggle = _ => {
    allToggle = false
    update(View)
}
const toggleAll = val => {
    allToggle = val
    todos.forEach(t => {
        t.done = val
        t.setDone(val)
    })
    update(View)
}
const ToggleAll = _ => <input title="toggle all" type="checkbox" onclick={_ => toggleAll(!allToggle)} checked={allToggle} />
const View = define(_ => (
    <main>
        <ToggleAll />
        
        <NewTodoInput />
        
        <ul>
        {todos.filter({
            all: t => true,
            complete: t => t.done,
            active: t => !t.done,
        }[filter]).map(t => <t.view />)}
        </ul>
        <ItemsLeft /> 
        
        Filter:
        <select onchange={ev => setFilter(ev.target.value)}>
            <option value="all" selected={filter==="all"}>All</option>
            <option value="complete" selected={filter==="complete"}>Complete</option>
            <option value="active" selected={filter==="active"}>Active</option>
        </select>
        
        {todos.filter(t => t.done).length > 0 ? <button onclick={clearCompleted}>Clear Completed</button> : ''}
    </main>
))

document.body.innerHTML=''
mount(View, document.body)