(function () {
    'use strict';

    /*
    TODO refactor tests to be more descriptive of the api and less "incrementally built up"

    TODO: Optimize: textnodes are always inserted, then the old ones removed. If they're the same string we could leave them alone
    TODO: Optimize: If keyed nodes move down, we will instead move *up* every subsequent nodes one step. COuld be optimized
    by just building a list of moves, and notice that a series of up-moves of one, could be replaced by a single
    down move (maybe?)
    */

    function h (type, attributes, ...children) {
        attributes = attributes || {};
        children = [].concat(...[].concat(...children)).filter(c => (c !== false && c != null));
        return (typeof type === 'function') ? type(attributes, children) : {type, attributes, children}
    }

    function mount (vnode, container) {
        const el = make(vnode);
        container.innerHTML = '';
        container.appendChild(el);
        return el
    }

    function define (func, data) {
        return {func, data}
    }


    function update (view, data) {
        view.data = data;
        view.instances = view.instances || []; //common pattern with makeInstance --> factor out
        view.instances.forEach(inst => patchInstance(inst.el, view, inst.attributes, inst.children));
    }

    //-------------

    function make (vnode, svg) {
        if (vnode.func) return make(h(vnode))
        if (!vnode.type) return document.createTextNode(vnode)
        return (vnode.type.func ? makeInstance : makeElement)(vnode, svg)
    }

    function patch (el, oldnode, newnode) {
        if (oldnode.type && oldnode.type === newnode.type) {
            if (oldnode.type.func) {
                el = patchInstance(el, newnode.type, newnode.attributes, newnode.children);
            } else {
                el = patchElement(el, oldnode.attributes, oldnode.children, newnode.attributes, newnode.children);
            }
        } else {
            el = replace(el, oldnode, newnode);
        }
        return el
    }

    function remove(el, oldvnode) {
        if (willRemove(el, oldvnode)) return false
        el.parentNode && el.parentNode.removeChild(el);
        return true
    }

    function replace (el, oldvnode, newvnode) {
        const prevent = willRemove(el, oldvnode);
        const newel = make(newvnode);
        if (el.parentNode) {
            if (prevent) el.parentNode.insertBefore(newel, el);
            else el.parentNode.replaceChild(newel, el);
        }
        return newel
    }

    function willRemove(el, oldvnode) {
        if (!oldvnode.type) return false
        if (oldvnode.type.func) return willRemoveInstance(el, oldvnode)
        return willRemoveElement(el, oldvnode)
    }

    //-------------

    function makeInstance ({type, attributes, children}) {
        const vnode = vnodeForView(type, attributes, children);
        const el = make(vnode);
        type.instances = type.instances || [];
        type.instances.push({el, vnode, attributes, children});
        return el
    }

    function patchInstance (oldel, view, attributes, children) {
        function getKey (node) {
            const attr = node.attributes;
            return (attr && attr.key) ? attr.key : null 
        }
        const vnode = vnodeForView(view, attributes, children);
        const inst = getInstanceIndex(view, oldel);
        const oldvnode = view.instances[inst].vnode;
        const el = (getKey(oldvnode) === getKey(vnode) ? patch : replace)(oldel, oldvnode, vnode);
        view.instances.splice(inst, 1, {el, vnode, attributes, children});
        return el
    }

    function willRemoveInstance (el, {type}) {
        const index = getInstanceIndex(type, el);
        const instance = type.instances[index];
        type.instances.splice(index, 1);
        return willRemove(el, instance.vnode)
    }

    function getInstanceIndex(type, el) {
        return seekIndex(type.instances, inst => (inst.el === el))
    }

    function vnodeForView(type, attributes, children) {
        return type.func(Object.assign({}, attributes, type.data), children)
    }

    //-------------

    function makeElement ({type, attributes, children}, svg=false) {
        svg = svg || (type === 'svg');
        const el = svg ? document.createElementNS('http://www.w3.org/2000/svg', type) : document.createElement(type);
        updateAttributes(el, {}, attributes);
        children.forEach(chnode => el.appendChild(make(chnode, svg)));
        attributes.oncreate && attributes.oncreate(el);
        return el
    }

    function patchElement(el, oldattr, oldch, newattr, newch) {
        updateAttributes(el, oldattr, newattr);
        patchChildren(el, oldch, newch);
        newattr.onupdate && newattr.onupdate(el);
        return el
    }

    function willRemoveElement (el, {attributes, children}) {
        children.forEach((c, i) => willRemove(el.childNodes[i], c));
        return attributes.onremove && attributes.onremove(el)
    }

    //-----------------

    function patchChildren(parent, oldch, newch) {
        oldch = oldch.slice(); //copy, since we'll be mutating it further down.
        let n = 0;
        while (n < oldch.length && n < newch.length) {
            let o = seekNode(oldch, newch[n], n);
            if (o < 0) {
                parent.insertBefore(make(newch[n]), parent.childNodes[n]);
                oldch.splice(n, 0, '');
            } else {
                if (o != n) {
                    parent.insertBefore(parent.childNodes[o], parent.childNodes[n]);
                    oldch.splice(n, 0, oldch.splice(o, 1)[0]);
                }
                patch(parent.childNodes[n], oldch[n], newch[n]);
            }
            n++;
        }
        while (n < oldch.length) {
            const didRemove = remove(parent.childNodes[n], oldch[n]);
            if (!didRemove) n++;
            else oldch.splice(n, 1);
        }
        while (n < newch.length)  parent.appendChild(make(newch[n++]));
    }


    function seekNode(list, node, start) {
        const sought = seekId(node);
        return seekIndex(list, item => (seekId(item) === sought), start)
    }

    function seekId(node) {
        return node.type ? (node.attributes.key || node.type) : node
    }

    function updateAttributes (el, oldattr, newattr) {
        Object.keys(oldattr).forEach(name => {
            if (newattr[name] == null) setAttribute(el, name);
        });
        Object.keys(newattr).forEach(name => {
            setAttribute(el, name, oldattr[name], newattr[name]);
        });
    }

    function setAttribute(el, name, oldval, val) {
        if (name === 'key' || name === 'value' || name === 'checked' || name.substr(0,2) === 'on') {
            el[name] = val;
        } else if (val == null || val === false) {
            el.removeAttribute(name);
        } else if (oldval !== val) {
            el.setAttribute(name, val);
        }
    }

    //----------------

    function seekIndex(list, fn, start = 0) {
        return list.reduce((found, item, index) => (index < start || found > -1 || !fn(item)) ? found : index, -1)
    }

    class RunnableExample extends HTMLElement {
        runCode () {
            const code = this.textContent;
            Function(
                'h', 'mount', 'define', 'update', 'make', 'patch',
                code
            )(h, mount, define, update, make, patch);
        }
        connectedCallback () {
            //to let the syntax highlighter do its work first
            setTimeout(_ => {
                const shadow = this.attachShadow({mode: 'open'});
                shadow.appendChild(make(
                    h('style', {}, `
                    @import url('./assets/prism.css');
                    .runnable {
                        border: 1px black solid;
                    }
                    .code {
                        border-bottom: 1px black solid;
                    }
                `)
                ));
                shadow.appendChild(make(
                    h('div', {class: 'runnable',}, [
                        h('div', {
                            class: 'code',
                            oncreate: el => el.innerHTML = this.innerHTML
                        }),
                        h('button', {onclick: _ => this.runCode()}, 'Run')
                    ])
                ));
            }, 0);
        }
    }

    customElements.define('runnable-example', RunnableExample);

}());
