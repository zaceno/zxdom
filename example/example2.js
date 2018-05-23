import {h, mount, define, update} from '../src/index.js'

const Editable = ({editing, value, set}, children) => {
    return editing ? (
        <input
            type="text"
            value={value}
            onchange={ev => set(ev.target.value)}
        />
    ) : children
}


const DeletableDecorator = ({ondelete}) => {
    const view = define(({active, enabled}, children) => {
        children[0].attr.onmouseover = _ => update(view, {active: true})
        children[0].attr.onmouseout = _ => update(view, {active: false})
        if (enabled && active) {
            children[0].chld = [].concat(children[0].chld, <button onclick={ondelete}>X</button>)
        }
        return children[0]
    })
    return view
}

const TodoItemView = props => (
    <props.deleteable enabled={!props.editing}>
        <li>
            <Editable
                editing={props.editing}
                value={props.text}
                set={props.setText}
            >
                <input type="checkbox" onclick={props.toggle} checked={props.done} />
                <span onclick={props.startEditing} style={(props.done ? ' text-decoration: line-through; opacity: 0.5;' : '')}>{props.text}</span>   
            </Editable>
        </li>
    </props.deleteable>
)

const TodoItem = ({text, onchangedone, ondelete, ontoggle}) => {

    const state = {done: false, text}
    var editing = false
    var showingDeleter = false

    const deleteable = DeletableDecorator({ondelete})
    const view = define(_ => h(TodoItemView, {
        deleteable,
        text: state.text,
        setText,
        editing,
        startEditing,

        done: state.done,
        toggle,
    }))
    const showDeleter = _ => {
        showingDeleter = true
        update(view)
    }
    const hideDeleter = _ => {
        showingDeleter = false
        update(view)
    }
    const toggle = _ => {
        state.done = !state.done
        ontoggle()
        update(view)
        onchangedone()
    }
    const startEditing = _ => {
        editing = true
        update(view)
    }
    const setText = x => {
        state.text = x
        editing = false
        update(view)
    }
    const setDone = x => {
        state.done = x
        update(view)
    }
    return {view, state, setDone}
}



var todos = []
var filter = 'all'

const addTodo = text => {
    
    const newTodo = TodoItem({
        text,
        onchangedone: _ => update(View),
        ondelete: _ => {
            todos.splice(todos.indexOf(newTodo), 1)
            update(View)
        },
        ontoggle: _ => resetAllToggle()
    })

    todos.push(newTodo)
    resetAllToggle()
}

const submitNewTodo = value => {
    update(NewTodoInput, {value: ''})
    addTodo(value)
}

const ItemsLeft = _ => {
    const n = todos.filter(({state: {done}}) => !done).length
    return n ? `Items left: ${n}` : ''
}

const setFilter = val => {
    filter = val
    update(View)
}


const FilterSelector = _ => ([
    'Filter:',
    <select onchange={ev => setFilter(ev.target.value)}>
        <option value="all" selected={filter==="all"}>All</option>
        <option value="complete" selected={filter==="complete"}>Complete</option>
        <option value="active" selected={filter==="active"}>Active</option>
    </select>
])

const clearCompleted = _ => {
    todos = todos.filter(t => !t.state.done)
    update(View)
}

const ClearCompletedButton = _ => (todos.filter(t => t.state.done).length > 0 ? <button onclick={clearCompleted}>Clear Completed</button> : '')

const NewTodoInput = define(({value}) => (
    <input
        placeholder="What needs to get done"
        value={value}
        onchange={ev => submitNewTodo(ev.target.value)}
    />
), {value: ''})

const TodoList = _ => (
    <ul>{todos.filter({
        all: t => true,
        complete: t => t.state.done,
        active: t => !t.state.done
    }[filter]).map(todo => (
        <li>
            <todo.view />
        </li>
    ))}</ul>
)

var allToggle = false
const resetAllToggle = _ => {
    allToggle = false
    update(View)
}
const toggleAll = val => {
    allToggle = val
    todos.forEach(t => t.setDone(val))
}
const ToggleAll = _ => <input title="toggle all" type="checkbox" onclick={_ => toggleAll(!allToggle)} checked={allToggle} />
const View = define(_ => (
    <main>
        <ToggleAll /> <NewTodoInput />
        <TodoList />
        <ItemsLeft /> <FilterSelector /> <ClearCompletedButton />
    </main>
))

document.body.innerHTML=''
mount(View, document.body)