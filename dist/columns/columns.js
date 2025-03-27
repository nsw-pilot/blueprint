function n(c){const i=[...c.firstElementChild.children];c.classList.add(`columns-${i.length}-cols`),[...c.children].forEach(l=>{[...l.children].forEach(t=>{const s=t.querySelector("picture");if(s){const e=s.closest("div");e&&e.children.length===1&&e.classList.add("columns-img-col")}})})}export{n as default};
//# sourceMappingURL=columns.js.map
