/*
TODO add svg support back

TODO add keys & lifecycle back

TODO refactor common patterns like "find index of thing in array", and perhaps others, to utility functions

TODO refactor functions that will use less property-names, and also make the code more readable and descriptive what is being done.

TODO refactor tests to be more descriptive of the api and less "incrementally built up"
*/


/* TODO: fix this so it handles boolean attrs properly (like disabled)
    once it does, we can probably get away with not using props for any
*/


function seekIndex(list, fn, start = 0) {
    return list.reduce((found, item, index) => (index < start || found > -1 || !fn(item)) ? found : index, -1)
}


function setAttribute(el, name, oldval, val) {
    if (name === 'key' || name === 'value' || name === 'checked' || name.substr(0,2) === 'on') {
        el[name] = val
    } else if (val == null || val === false) {
        el.removeAttribute(name)
    } else if (oldval !== val) {
        el.setAttribute(name, val)
    }
}

function updateAttributes (el, oldattr, newattr) {
    Object.keys(oldattr).forEach(name => {
        if (newattr[name] == null) setAttribute(el, name)
    })
    Object.keys(newattr).forEach(name => {
        setAttribute(el, name, oldattr[name], newattr[name])
    })
}

function willRemove(el, oldvnode) {
    if (oldvnode.type) {
        const {type, attributes, children} = oldvnode
        if (type.func) {
            const inst = getInstanceIndex(type, el)
            willRemove(el, type.instances[inst].vnode)
            type.instances.splice(inst, 1)
        } else {
            children.forEach((chvnode, i) => willRemove(el.childNodes[i], chvnode))
            attributes.onremove && attributes.onremove(el)
        }    
    }
}

function remove(el, oldvnode) {
    willRemove(el, oldvnode)
    el.parentNode && el.parentNode.removeChild(el)
}

function getKey (node) {
    const attr = node.attributes
    return (attr && attr.key) ? attr.key : null 
}


function morphInstance (oldel, view, attributes, children) {
    const vnode = view.func(Object.assign({}, attributes, view.data), children)
    const inst = getInstanceIndex(view, oldel)
    const oldvnode = view.instances[inst].vnode
    const el = (getKey(oldvnode) === getKey(vnode) ? patch : replace)(oldel, oldvnode, vnode)
    view.instances.splice(inst, 1, {el, vnode, attributes, children})
    return el
}


/*

OPTIMIZE:

textnodes are always inserted, then the old ones removed. If they're the same string we could leave them alone

If keyed nodes move down, we will instead move *up* every subsequent nodes one step. COuld be optimized
by just building a list of moves, and notice that a series of up-moves of one, could be replaced by a single
down move (maybe?)

*/

function seekId(node) {
    return node.type ? (node.attributes.key || node.type) : node
}
function seekNode(list, node, start) {
    const sought = seekId(node)
    return seekIndex(list, item => (seekId(item) === sought), start)
}

function patchChildren(parent, oldch, newch) {
    let n = 0
    while (n < oldch.length && n < newch.length) {
        let o = seekNode(oldch, newch[n], n)
        if (o < 0) {
            parent.insertBefore(make(newch[n]), parent.childNodes[n])
            oldch.splice(n, 0, '')
        } else {
            if (o != n) {
                parent.insertBefore(parent.childNodes[o], parent.childNodes[n])
                oldch.splice(n, 0, oldch.splice(o, 1)[0])
            }
            patch(parent.childNodes[n], oldch[n], newch[n])
        }
        n++
    }
    while (n < oldch.length) {
        remove(parent.childNodes[n], oldch[n])
        oldch.splice(n, 1)
    }
    while (n < newch.length)  parent.appendChild(make(newch[n++]))
}


function morphVNode(el, oldattr, oldch, newattr, newch) {
    updateAttributes(el, oldattr, newattr)
    patchChildren(el, oldch, newch)
    newattr.onupdate && newattr.onupdate(el)
    return el
}


function morph (el, oldvnode, {type, attributes, children}) {
    if (type.func) return morphInstance(el, type, attributes, children)
    else return morphVNode(el, oldvnode.attributes, oldvnode.children, attributes, children)
}

function replace (el, oldvnode, newvnode) {
    willRemove(el, oldvnode)
    const newel = make(newvnode)
    el.parentNode && el.parentNode.replaceChild(newel, el)
    return newel
}


function patch (el, oldnode, newnode) {
    return (oldnode.type && oldnode.type === newnode.type ? morph : replace)(el, oldnode, newnode) 
}

function getInstanceIndex(type, el) {
    return seekIndex(type.instances, inst => (inst.el === el))
}

function makeView (type, attributes, children) {
    const vnode = type.func(Object.assign({}, attributes, type.data), children) //common with morphInstance --> factor out.
    const el = make(vnode)
    type.instances = type.instances || []
    type.instances.push({el, vnode, attributes, children})
    return el
}

function makeNode ({type, attributes={}, children=[]}, svg=false) {
    if (type.func) return makeView(type, attributes, children)
    svg = svg || (type === 'svg')
    const el = svg ? document.createElementNS('http://www.w3.org/2000/svg', type) : document.createElement(type)
    updateAttributes(el, {}, attributes)
    children.forEach(chnode => el.appendChild(make(chnode, svg)))
    attributes.oncreate && attributes.oncreate(el)
    return el
}

function make (vnode, svg) {
    return vnode.type ? makeNode(vnode, svg) : document.createTextNode(vnode)
}

function h (type, attributes, ...children) {
    attributes = attributes || {}
    children = [].concat(...[].concat(...children)).filter(c => (c !== false && c != null))
    return (typeof type === 'function') ? type(attributes, children) : {type, attributes, children}
}

function define (func, data) {
    return {func, data}
}

function mount (vnode, container) {
    const el = make(vnode.func ? h(vnode) : vnode)
    container.innerHTML = ''
    container.appendChild(el)
}

function update (view, data) {
    view.data = data
    view.instances = view.instances || [] //common pattern with makeInstance --> factor out
    view.instances.forEach(inst => morphInstance(inst.el, view, inst.attributes, inst.children))
}

export {h, patch, make, mount, define, update}