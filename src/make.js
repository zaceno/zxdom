import updateAttr from './attr'

function makeHTMLElement ({tag, attr, chld}, svg = false) {
    const oncreate = attr.oncreate
    svg = svg || (tag === 'svg')
    const el = svg ? document.createElementNS('http://www.w3.org/2000/svg', tag) : document.createElement(tag)
    updateAttr(el, {}, attr)
    chld.forEach(c => el.appendChild(make(c, svg)))
    if (oncreate) {
        oncreate(el)
    }
    return el
}

function makeTextNode (text) {
    return document.createTextNode(text)
}

function makeComponentInstance (inst) {
    inst.el = make(inst.vnode)
    inst.component.instances.push(inst)
    return inst.el
}

export default function make (vnode, svg) {
    return (
        vnode.component ? makeComponentInstance
        : vnode.tag ? makeHTMLElement
        : makeTextNode
    )(vnode, svg)
}
