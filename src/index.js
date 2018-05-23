import patch from './patch'
import make from './make'
import h from './h'
import {update, define} from './component'

export {patch, make, h, define, update}
export function mount (vnode, parent) {
    if (vnode.func) vnode = h(vnode)
    parent.appendChild(make(vnode))
}