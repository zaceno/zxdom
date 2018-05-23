import updateAttr from './attr'
import make from './make'

function replace(el, vnode, oldnode) {
    const newel = make(vnode)
    const parent = el.parentNode
    if (parent) {
        callOnRemove(el, oldnode)
        parent.replaceChild(newel, el)
    }
    return newel
}

function callOnRemove(el, oldnode) {
    let {attr, chld} = oldnode
    let chel = el.childNodes
    if (attr && attr.onremove) attr.onremove(el)
    if (chld) chld.forEach((chnode, i) => callOnRemove(chel[i], chnode))
} 

function getIndexOfVNode(vnodes, keyOrTag, start = 0) {
    for (let i = start; i < vnodes.length; i++) {
        let node = vnodes[i]
        if (node.attr && node.attr.key) {
            if (node.attr.key === keyOrTag) return i
            continue
        } else if (node.tag === keyOrTag) {
            return i
        }
    }
}

function getKeyOrTagOfVNode(vnode) {
    if (vnode.attr && vnode.attr.key) return vnode.attr.key
    return vnode.tag
}

function updateChildren(parentEl, oldChildren = [], newChildren = []) {
    var n = 0
    while (n < oldChildren.length && n < newChildren.length) {
        let newVNode = newChildren[n]
        let o = getIndexOfVNode(oldChildren, getKeyOrTagOfVNode(newVNode), n)
        let el = parentEl.childNodes[n]
        if (o == null) {
            parentEl.insertBefore(make(newVNode), el)
            oldChildren.splice(n, 0, null)
        } else {
            let oldVNode = ((o != null) && oldChildren[o])
            if (o == n) {
                patch(el, oldVNode, newVNode)
            } else {
                //move element from old position to new position
                let el2 =  parentEl.childNodes[o]
                parentEl.insertBefore(el2, el)
                oldChildren.splice(n, 0, oldChildren.splice(o, 1)[0]) //corresponding move in oldchildren
                patch(el2, oldVNode, newVNode)
            }
        }
        n++
    }
    while (n < oldChildren.length) {
        let el = parentEl.childNodes[n]
        callOnRemove(el, oldChildren[n])
        parentEl.removeChild(el)
        oldChildren.splice(n, 1)
    }
    while (n < newChildren.length) {
        parentEl.appendChild(make(newChildren[n++]))
    }
}

function setComponentInstance(oldnode, newnode) {
    const instances = oldnode.component.instances
    const index = instances.indexOf(oldnode)
    if (newnode) instances.splice(index, 1, newnode)
    else instances.splice(index, 1)
}


function sameNode(node1, node2) {
    return (getKeyOrTagOfVNode(node1) === getKeyOrTagOfVNode(node2))
}

function updateNode(el, oldnode, newnode) {
    updateAttr(el, oldnode.attr, newnode.attr)
    updateChildren(el, oldnode.chld, newnode.chld)
    if (newnode.attr && newnode.attr.onupdate) {
        newnode.attr.onupdate(el)
    }
}

export default function patch (el, oldnode, newnode) {
    if (oldnode.component) {
        if ( oldnode.component === newnode.component ) {
            setComponentInstance(oldnode, newnode)
            el = patch(el, oldnode.vnode, newnode.vnode)
            newnode.el = el
        } else {
            setComponentInstance(oldnode) //remove the old component instance
            el = replace(el, newnode.vnode, oldnode.vnode)
        }
    } else if (oldnode.tag) {
        //DOING A KEYCHECK HERE PROBABLY ONLY MAKES SENSE
        //FOR TOP LEVEL NODES OF COMPONENTS. OTHERWISE,
        //IT'S CHECKED IN CHILDREN SO PERHAPS DIFFERENTIATE. 
        if (sameNode(oldnode, newnode)) {
            updateNode(el, oldnode, newnode)
        } else {
            el = replace(el, newnode, oldnode)
        }
    } else if (oldnode !== newnode) {
        el = replace(el, newnode, oldnode)
    }
    return el
}
