import patch from './patch'
import h from './h'

export function define (func, initial = {}) {
    return {
        func,
        state: initial,
        instances: []
    }
}

export function update (component, state={}) {
    component.state = state
    component.instances.forEach(inst => {
        patch(inst.el, inst, h(component, Object.assign({}, inst.attr), inst.chld))
    })    
}