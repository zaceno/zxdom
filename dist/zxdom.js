!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(t.zxdom={})}(this,function(t){"use strict";function e(t,e,n,o){"key"===e||"value"===e||"selected"===e||"checked"===e||"on"===e.substr(0,2)?t[e]=o:null==o?t.removeAttribute(e):n!==o&&t.setAttribute(e,o)}function n(t,n,o){return Object.keys(n).forEach(n=>{null==o[n]&&e(t,n,t)}),Object.keys(o).forEach(c=>{e(t,c,n[c],o[c])}),t}function o(t,e){return(t.component?function(t){return t.el=o(t.vnode),t.component.instances.push(t),t.el}:t.tag?function({tag:t,attr:e,chld:c},r=!1){const u=e.oncreate,i=(r=r||"svg"===t)?document.createElementNS("http://www.w3.org/2000/svg",t):document.createElement(t);return n(i,{},e),c.forEach(t=>i.appendChild(o(t,r))),u&&u(i),i}:function(t){return document.createTextNode(t)})(t,e)}function c(t,e,n){t.insertBefore(e,t.childNodes[n])}function r(t,e,n){const c=o(e),r=t.parentNode;return r&&(u(t,n),r.replaceChild(c,t)),c}function u(t,e){e=e.vnode||e;let{attr:n,chld:o}=e;n&&n.onremove&&n.onremove(t),o&&o.forEach((e,n)=>u(t.childNodes[n],e))}function i(t,e,n=0){for(let o=n;o<t.length;o++){let n=t[o];if(n.attr&&n.attr.key){if(n.attr.key===e)return o}else if(n.tag===e)return o}}function a(t){return(t=t.vnode||t).attr&&t.attr.key?t.attr.key:t.tag}function l(t,e){const n=t.component.instances,o=n.indexOf(t);e?n.splice(o,1,e):n.splice(o,1)}function f(t,e,d){return e.component?e.component===d.component?(l(e,d),t=f(t,e.vnode,d.vnode),d.el=t):(l(e),t=r(t,d.vnode||d,e.vnode)):e.tag?a(e)===a(d)?(n(t,e.attr,d.attr),function(t,e=[],n=[]){let r=0;const l=t.childNodes;for(;r<e.length&&r<n.length;){let u=i(e,a(n[r]),r);null==u?(c(t,o(n[r]),r),e.splice(r,0,null)):(u!=r&&(c(t,l[u],r),e.splice(r,0,e.splice(u,1)[0])),f(l[r],e[r],n[r])),r++}for(;r<e.length;)u(l[r],e[r]),t.removeChild(l[r]),e.splice(r,1);for(;r<n.length;)c(t,o(n[r++]),r)}(t,e.chld,d.chld),d.attr&&d.attr.onupdate&&d.attr.onupdate(t)):t=r(t,d,e):e!==d&&(t=r(t,d,e)),t}function d(t,e,...n){return e=e||{},n=[].concat(...[].concat(...n)),t.func?{component:t,vnode:t.func(Object.assign({},e,t.state),n),attr:e,chld:n}:"function"==typeof t?t(e,n):{tag:t,attr:e,chld:n}}t.patch=f,t.make=o,t.h=d,t.define=function(t,e={}){return{func:t,state:e,instances:[]}},t.update=function(t,e={}){t.state=e,t.instances.forEach(e=>{f(e.el,e,d(t,Object.assign({},e.attr),e.chld))})},t.mount=function(t,e){t.func&&(t=d(t)),e.appendChild(o(t))},Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=zxdom.js.map