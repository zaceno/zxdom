const model = (initial, actionDefs, onupdate) => {
    var state = Object.assign({}, initial)
    var actions = {}
    var updating = false
    Object.keys(actionDefs).forEach(name => {
        actions[name] = (...args) => {
            var ret = actionDefs[name](...args)
            if (typeof ret === 'function') ret = ret(state, actions)
            if (ret) state = Object.assign({}, state, ret)
            if (!updating) {
                updating = true
                setTimeout(_ => {
                    onupdate(state, actions)
                    updating = false
                }, 0)
            }
        }
    })
    onupdate(state, actions)
    return actions
}

export default model