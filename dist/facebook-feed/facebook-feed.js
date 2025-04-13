/* empty css                      */import{g as l}from"../chunks/aem-DrEuio_w.js";const d="facebookapi",h="/src/blocks/facebook-feed/fbApi.json",f={headers:{Authorization:"Bearer ZmFjZWJvb2stc3dzLWF1dGhvcml6ZXItc3dzLWNsb3VkOktlbm5ldGhTV1M=","Content-Type":"application/json"}};async function p(){const t=window.location.hostname==="localhost";try{const s=await l();return t&&(!s||!s[d])?h:s[d]}catch(s){console.error("Error fetching placeholders:",s);return}}async function w(t){return new Promise(s=>{s(null),(async()=>{const n=await p();if(n)try{const e=await fetch(n,{method:"GET",...f});if(!e.ok)throw new Error(`Facebook API request failed: ${e.statusText}`);const o=await e.json();if(!o||!o.length||!o[0].posts)throw new Error("No Facebook posts found");const r=JSON.parse(o[0].posts),a=[];for(let c=0;c<r.length;c+=1){const i=r[c];if(i.full_picture&&i.message&&(a.push(i),a.length===3))break}m(a,t)}catch(e){console.error("Error fetching Facebook API:",e)}})()})}function m(t,s){if(!t||!t.length||!s)return;const n=t.map(o=>`<div class = 'nsw-col nsw-col-md-6 nsw-col-lg-4'>
      <div class = 'nsw-card nsw-card--highlight'>
        <div class="nsw-card__image">
        <img src="${o.full_picture}" alt="Facebook post image">
        </div>
        <div class="nsw-card__content">
          <div class="nsw-card__copy">
            <p>
              <a href='https://www.facebook.com/${o.id}'>${o.message}</a>
            </p>
          </div>
          <div class='card-icon'>
            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="#1578f2" d="M32 16.098C32 7.207 24.837 0 16 0S0 7.207 0 16.098C0 24.133 5.851 30.793 13.5 32V20.751H9.437v-4.653H13.5v-3.547c0-4.035 2.389-6.263 6.043-6.263 1.751 0 3.582.314 3.582.314v3.962h-2.018c-1.988 0-2.607 1.241-2.607 2.514v3.02h4.438l-.709 4.653h-3.728V32c7.649-1.208 13.5-7.867 13.5-15.902z"/></svg>
          </div>
          <span class="material-icons nsw-material-icons" focusable="false" aria-hidden="true">east</span>
        </div>
      </div>
    </div>`),e=document.createElement("div");e.classList.add("nsw-grid"),e.innerHTML=n.join(""),s.textContent="",s.append(e)}async function v(t){const s=document.createElement("div");s.classList.add("nsw-grid"),s.innerHTML=`<div class="nsw-col nsw-col-md-12">
    <p>Loading Facebook posts...</p>
  </div>`,t.textContent="",t.append(s),await w(t)}export{v as default};
//# sourceMappingURL=facebook-feed.js.map
