
const positionTracker = (_ => {
    
    const tracked = []
    
    function getPosition (el) {
        var {left, top} = el.getBoundingClientRect()
        return [Math.floor(left), Math.floor(top)]
    }

    function update (el) {
        var [x, y] = getPosition(el)
        el._x = x
        el._y = y
    }
    
    const updateAll = function () {
        tracked.forEach(update)
    }

    function start (el) {
        tracked.push(el)
        update(el)
    }
    
    function stop(el) {
        const index = tracked.indexOf(el)
        if (index < 0) return
        tracked.splice(index, 1)
    }
    
    
    function delta (el) {
        if (!el._x) return {x: 0, y:0}
        var [x, y] = getPosition(el)
        return {x: el._x - x, y: el._y - y}
    }
    
    addEventListener('scroll', updateAll)
    addEventListener('resize', updateAll)

    return {update, delta, start, stop, updateAll}

})()



const transitions = (_ => {

    function enter(el, runclass, entryclass) {
        const onend = () => {
            el.removeEventListener('transitionend', onend)
            el.classList.remove(runclass)
        }
        el.addEventListener('transitionend', onend)

        positionTracker.start(el)
        el.classList.add(entryclass)
        requestAnimationFrame(_ => {
            requestAnimationFrame(_ => {
                el.classList.add(runclass)
                el.classList.remove(entryclass)
            })
        })
    }     
    
    function exit(el, runclass, exitclass, lifecycleManager) {
        lifecycleManager.sneaky(parent => parent.appendChild(el))

        //fetch transform matrix we'll have when exitclass is applied
        el.classList.add(exitclass)
        const sty = getComputedStyle(el)
        const trf = sty.getPropertyValue('transform')
        const [sx, wx, wy, sy, tx, ty] = (trf === 'none')
            ? [1, 0, 0, 1, 0, 0]
            : trf.match(/^matrix\(([^\)]*)\)$/)[1].split(', ').map(s => +s)
        el.classList.remove(exitclass)

        const onend = () => {
            el.removeEventListener('transitionend', onend)
            positionTracker.stop(el)
            if (el.parentNode) lifecycleManager.sneaky(parent => parent.removeChild(el))
        }
        el.addEventListener('transitionend', onend)

        const offs = positionTracker.delta(el)
        positionTracker.update(el)
        el.style.transform = `translate(${offs.x}px, ${offs.y}px)`
        requestAnimationFrame(_ => {
            requestAnimationFrame(_ => {
                el.classList.add(runclass)
                el.classList.add(exitclass)
                el.style.transform = `matrix(${sx}, ${wx}, ${wy}, ${sy}, ${tx+offs.x}, ${ty+offs.y})`
            })
        })
    }
    
    function move(el, runclass) {
        const onend = () => {
            positionTracker.update(el)
            el.removeEventListener('transitionend', onend)
            el.classList.remove(runclass)
        }
        el.addEventListener('transitionend', onend)
        const t = positionTracker.delta(el)
        positionTracker.update(el)
        el.style.transform = `translate(${t.x}px, ${t.y}px)`
        requestAnimationFrame(_ => {
            el.classList.add(runclass)
            el.style.transform = null
        })
    }
    return {enter, exit, move}
})()



function lifecycle(parent) {
    var ignore = false
    var onupdate = false
    var oncreate = false
    var onremove = false
    const observer = new MutationObserver(mutations => {
        if (ignore) return
        const addedNodes = [].concat(...mutations.map(m => Array.from(m.addedNodes)))
        const removedNodes = [].concat(...mutations.map(m => Array.from(m.removedNodes)))

        parent.childNodes.forEach(el => {
            if (!el.$added) return
            onupdate && onupdate(el)
        })
        addedNodes.forEach(el => {
            if (removedNodes.indexOf(el) >= 0) return
            el.$added = true
            oncreate && oncreate(el)
        })
        removedNodes.forEach(el => {
            if (addedNodes.indexOf(el) >= 0) return
            el.$added = false
            onremove && onremove(el)
        })
    })
    observer.observe(parent, {childList: true})
    return {
        sneaky (fn)  {
            ignore = true
            fn(parent)
            setTimeout(_ => {ignore = false}, 0)
        },
        handlers (h) {
            onremove = h.onremove
            oncreate = h.oncreate
            onupdate = h.onupdate
        }
    }
}


class ZXTransition extends HTMLElement{
    static get observedAttributes() {return ['name']; }
    constructor () {
        super()
        this.lc = lifecycle(this)
    }
    attributeChangedCallback (attr, oldval, newval) {
        //the only attr is 'name'
        this.lc.handlers({
            oncreate: el => transitions.enter(el, newval + '-enter-active', newval + '-enter'),
            onupdate: el => transitions.move(el, newval + '-active'),
            onremove: el => transitions.exit(el, newval + '-leave-active', newval + '-leave', this.lc),
        })
    }
}

customElements.define('zx-transition', ZXTransition)

