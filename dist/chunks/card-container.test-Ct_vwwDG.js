import l from"../card-container/card-container.js";import{d as m,b as u,i as p,g as h}from"./vi.DT3m61kS-BCSZ23XR.js";/* empty css              */import"./dom-helpers-BeLTcDSo.js";import"./aem-DrEuio_w.js";import"./main-Dhy2awUc.js";function d(t){return new DOMParser().parseFromString(t,"text/html").body.firstChild}function c(t){if(!t)return null;const o=t.cloneNode(!0),i=document.createTreeWalker(o,NodeFilter.SHOW_TEXT,null);for(let e=i.nextNode();e;e=i.nextNode())e.nodeValue=e.nodeValue.trim();function n(e){if(e.nodeType===1){const r=Array.from(e.attributes).sort((a,s)=>a.name.localeCompare(s.name));r.forEach(a=>e.removeAttribute(a.name)),r.forEach(a=>e.setAttribute(a.name,a.value.trim()))}Array.from(e.children).forEach(n)}return n(o),o}m("Card",()=>{let t;u(()=>{document.body.innerHTML='<div id="content"></div>',t=document.getElementById("content")}),p("Should be able to apply listing to a card",()=>{const o=`<div id="shady" 
    data-aue-resource="urn:aemconnection:/content/doe-experimentation/index/jcr:content/root/section_522321914/block_1115629554" 
    data-aue-type="container" 
    data-aue-behavior="component" 
    data-aue-model="cards" 
    data-aue-label="Cards" 
    data-aue-filter="cards" 
    class="cards highlight dark horizontal">
    <div data-aue-resource="urn:aemconnection:/content/doe-experimentation/index/jcr:content/root/section_522321914/block_1115629554/item" 
         data-aue-type="component" 
         data-aue-model="card" 
         data-aue-label="Card">
            <div><picture><img src="/content/dam/doe-experimentation/content-at-scale.png" data-aue-prop="image" data-aue-label="Image" data-aue-type="media"></picture></div>
        
            <div><a href="https://www.yahoo.com/" data-aue-prop="linkText" data-aue-label="Headline" data-aue-type="text">This is the headline</a></div>
        
            <div data-richtext-prop="text" data-richtext-label="Text" data-richtext-filter="text">This is some text</div>
       </div>
    </div>`,i=d(`
     <div id="shady"
     data-aue-resource="urn:aemconnection:/content/doe-experimentation/index/jcr:content/root/section_522321914/block_1115629554" 
     data-aue-type="container" 
     data-aue-behavior="component" 
     data-aue-model="cards" 
     data-aue-label="Cards" 
     data-aue-filter="cards" 
     class="cards highlight dark horizontal">
      <ul class="nsw-grid">
          <li class="nsw-col nsw-col-md-6 nsw-col-lg-4" 
          data-aue-resource="urn:aemconnection:/content/doe-experimentation/index/jcr:content/root/section_522321914/block_1115629554/item" 
          data-aue-type="component" data-aue-model="card" data-aue-label="Card">
              <div class="nsw-card nsw-card--highlight nsw-card--dark nsw-card--horizontal">
                <div class="nsw-card__image">
                   <picture>
                      <source srcset="/content/dam/doe-experimentation/content-at-scale.png?width=750&amp;format=webply&amp;optimize=medium"
                              type="image/webp">
                      <img alt="" data-aue-label="Image" data-aue-prop="image" data-aue-type="media" loading="lazy"
                           src="/content/dam/doe-experimentation/content-at-scale.png?width=750&amp;format=png&amp;optimize=medium">
                  </picture> 
                </div>
                <div class="nsw-card__content">
                    <div class="nsw-card__title">
                       <a href="https://www.yahoo.com/" data-aue-prop="linkText" data-aue-label="Headline" data-aue-type="text">This is the headline</a>
                    </div>
                    
                    <div class="nsw-card__copy"  data-richtext-prop="text" data-richtext-label="Text" data-richtext-filter="text">
                       This is some text
                    </div>
                    
                    <span aria-hidden="true" class="material-icons nsw-material-icons" focusable="false">east</span>
                </div>
              </div>
          </li>
      </ul>
    </div>`);t.insertAdjacentHTML("beforeend",o);const n=t.children[0];l(n);const e=c(d(n.outerHTML)).outerHTML,r=c(i).outerHTML;h(e).toBe(r)})});
//# sourceMappingURL=card-container.test-Ct_vwwDG.js.map
