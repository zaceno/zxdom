
function setAttr(el, name, oldval, val) {
    if (name === 'key' || name === 'value' || name.substr(0,2) === 'on') {
        el[name] = val
    } else if (val == null || val === false) {
        el.removeAttribute(name)
    } else if (oldval !== val) {
        el.setAttribute(name, val)
    }
}
//need a test: seems not to matter what we pass as third arg in first loop below
//also need a test for checked
export default function (el, oldAttr, newAttr) {
    Object.keys(oldAttr).forEach(name => {
        if (newAttr[name] == null) setAttr(el, name, el)
    })
    Object.keys(newAttr).forEach(name => {
        setAttr(el, name, oldAttr[name], newAttr[name])
    })
    return el
}