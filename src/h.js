
export default function h(type, attr, ...chld) {
    attr = attr || {}
    chld = [].concat(...[].concat(...chld)).filter(c => !!c) //flatten children into a single array
    if (!!type.func) return {
        component: type,
        vnode: type.func(Object.assign({}, attr, type.state), chld),
        attr,
        chld,
    }
    if (typeof type === 'function') return type(attr, chld)
    return {tag: type, attr, chld}
}
