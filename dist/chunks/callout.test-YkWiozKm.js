import s from"../callout/callout.js";import{d as u,b as p,i as m,g as b}from"./vi.DT3m61kS-BCSZ23XR.js";import"./main-Dhy2awUc.js";import"./aem-DrEuio_w.js";function c(e){return new DOMParser().parseFromString(e,"text/html").body.firstChild}function d(e){if(!e)return null;const o=e.cloneNode(!0),n=document.createTreeWalker(o,NodeFilter.SHOW_TEXT,null);for(let t=n.nextNode();t;t=n.nextNode())t.nodeValue=t.nodeValue.trim();function r(t){if(t.nodeType===1){const i=Array.from(t.attributes).sort((a,l)=>a.name.localeCompare(l.name));i.forEach(a=>t.removeAttribute(a.name)),i.forEach(a=>t.setAttribute(a.name,a.value.trim()))}Array.from(t.children).forEach(r)}return r(o),o}u("Card",()=>{let e;p(()=>{document.body.innerHTML='<div id="content"></div>',e=document.getElementById("content")}),m("Card retains its instrumentation",()=>{const o=`
    <div 
    data-aue-resource="urn:aemconnection:/content/doe/sws/schools/a/albury-h/index/jcr:content/root/section_2/block_2128512099"  
    data-aue-type="component" 
    data-aue-behavior="component" 
    data-aue-model="callout" 
    data-aue-label="callout" 
    class="callout">
      <div>
        <div data-aue-prop="title" data-aue-label="Title" data-aue-type="text"><p>Hi there</p></div>
      </div>
      <div>
        <div data-richtext-prop="description" data-richtext-label="Description" data-richtext-filter="text"><p>How are you going?</p></div>
      </div>
    </div>`,n=c(`
     <div class="callout nsw-callout"
     data-aue-resource="urn:aemconnection:/content/doe/sws/schools/a/albury-h/index/jcr:content/root/section_2/block_2128512099"
     data-aue-type="component" data-aue-behavior="component" data-aue-model="callout" data-aue-label="callout">
         <div class="nsw-callout__content">
             <p class="nsw-h4" data-aue-prop="title" data-aue-label="Title" data-aue-type="text">Hi there</p>
             <p data-richtext-prop="description" data-richtext-label="Description" data-richtext-filter="text">How are you going?</p>
        </div>
     </div>
     `);e.insertAdjacentHTML("beforeend",o);const r=e.children[0];s(r);const t=d(c(r.outerHTML)).outerHTML,i=d(n).outerHTML;b(t).toBe(i)})});
//# sourceMappingURL=callout.test-YkWiozKm.js.map
