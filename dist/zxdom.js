!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t(e.zxdom={})}(this,function(e){"use strict";function t(e,t,...n){return t=t||{},n=[].concat(...[].concat(...n)).filter(e=>!1!==e&&null!=e),"function"==typeof e?e(t,n):{type:e,attributes:t,children:n}}function n(e,c){return e.func?n(t(e)):e.type?(e.type.func?function({type:e,attributes:t,children:c}){const r=d(e,t,c),i=n(r);return e.instances=e.instances||[],e.instances.push({el:i,vnode:r,attributes:t,children:c}),i}:function({type:e,attributes:t,children:c},r=!1){const i=(r=r||"svg"===e)?document.createElementNS("http://www.w3.org/2000/svg",e):document.createElement(e);return l(i,{},t),c.forEach(e=>i.appendChild(n(e,r))),t.oncreate&&t.oncreate(i),i})(e,c):document.createTextNode(e)}function c(e,t,o){return e=t.type&&t.type===o.type?t.type.func?u(e,o.type,o.attributes,o.children):function(e,t,i,o,u){return l(e,t,o),function(e,t,i){t=t.slice();let o=0;for(;o<t.length&&o<i.length;){let r=a(t,i[o],o);r<0?(e.insertBefore(n(i[o]),e.childNodes[o]),t.splice(o,0,"")):(r!=o&&(e.insertBefore(e.childNodes[r],e.childNodes[o]),t.splice(o,0,t.splice(r,1)[0])),c(e.childNodes[o],t[o],i[o])),o++}for(;o<t.length;){const n=r(e.childNodes[o],t[o]);n?t.splice(o,1):o++}for(;o<i.length;)e.appendChild(n(i[o++]))}(e,i,u),o.onupdate&&o.onupdate(e),e}(e,t.attributes,t.children,o.attributes,o.children):i(e,t,o)}function r(e,t){return!o(e,t)&&(e.parentNode&&e.parentNode.removeChild(e),!0)}function i(e,t,c){const r=o(e,t),i=n(c);return e.parentNode&&(r?e.parentNode.insertBefore(i,e):e.parentNode.replaceChild(i,e)),i}function o(e,t){return!!t.type&&(t.type.func?function(e,{type:t}){const n=s(t,e),c=t.instances[n];return t.instances.splice(n,1),o(e,c.vnode)}(e,t):function(e,{attributes:t,children:n}){return n.forEach((t,n)=>o(e.childNodes[n],t)),t.onremove&&t.onremove(e)}(e,t))}function u(e,t,n,r){function o(e){const t=e.attributes;return t&&t.key?t.key:null}const u=d(t,n,r),a=s(t,e),f=t.instances[a].vnode,l=(o(f)===o(u)?c:i)(e,f,u);return t.instances.splice(a,1,{el:l,vnode:u,attributes:n,children:r}),l}function s(e,t){return h(e.instances,e=>e.el===t)}function d(e,t,n){return e.func(Object.assign({},t,e.data),n)}function a(e,t,n){const c=f(t);return h(e,e=>f(e)===c,n)}function f(e){return e.type?e.attributes.key||e.type:e}function l(e,t,n){Object.keys(t).forEach(t=>{null==n[t]&&p(e,t)}),Object.keys(n).forEach(c=>{p(e,c,t[c],n[c])})}function p(e,t,n,c){"key"===t||"value"===t||"checked"===t||"on"===t.substr(0,2)?e[t]=c:null==c||!1===c?e.removeAttribute(t):n!==c&&e.setAttribute(t,c)}function h(e,t,n=0){return e.reduce((e,c,r)=>r<n||e>-1||!t(c)?e:r,-1)}e.h=t,e.patch=c,e.make=n,e.mount=function(e,t){const c=n(e);return t.innerHTML="",t.appendChild(c),c},e.define=function(e,t){return{func:e,data:t}},e.update=function(e,t){e.data=t,e.instances=e.instances||[],e.instances.forEach(t=>u(t.el,e,t.attributes,t.children))},Object.defineProperty(e,"__esModule",{value:!0})});
//# sourceMappingURL=zxdom.js.map