/* empty css                      */import{g as d}from"../chunks/aem-DrEuio_w.js";const r="facebookapi",l="/src/blocks/facebook-feed/fbApi.json",f={headers:{Authorization:"Bearer ZmFjZWJvb2stc3dzLWF1dGhvcml6ZXItc3dzLWNsb3VkOktlbm5ldGhTV1M=","Content-Type":"application/json"}};async function h(){const o=window.location.hostname==="localhost";try{const e=await d();return o&&(!e||!e[r])?l:e[r]}catch(e){console.error("Error fetching placeholders:",e);return}}async function p(){return new Promise(o=>{o(null),(async()=>{const e=await h();if(e)try{const s=await fetch(e,{method:"GET",...f});if(!s.ok)throw new Error(`Facebook API request failed: ${s.statusText}`);const t=await s.json();if(!t||!t.length||!t[0].posts)throw new Error("No Facebook posts found");const n=JSON.parse(t[0].posts),c=[];for(let a=0;a<n.length;a+=1){const i=n[a];if(i.full_picture&&i.message&&(c.push(i),c.length===3))break}w(c)}catch(s){console.error("Error fetching Facebook API:",s)}})()})}function w(o){if(!o||!o.length)return;const e=document.querySelector(".facebook-feed");if(!e)return;const s=o.map(n=>`<div class = 'nsw-col nsw-col-md-6 nsw-col-lg-4'>
      <div class = 'nsw-card nsw-card--highlight'>
        <div class="nsw-card__image">
        <img src="${n.full_picture}" alt="Facebook post image">
        </div>
        <div class="nsw-card__content">
          <div class="nsw-card__copy">
            <p>
              <a href='https://www.facebook.com/${n.id}'>${n.message}</a>
            </p>
          </div>
          <div class='card-icon'>
            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="#1578f2" d="M32 16.098C32 7.207 24.837 0 16 0S0 7.207 0 16.098C0 24.133 5.851 30.793 13.5 32V20.751H9.437v-4.653H13.5v-3.547c0-4.035 2.389-6.263 6.043-6.263 1.751 0 3.582.314 3.582.314v3.962h-2.018c-1.988 0-2.607 1.241-2.607 2.514v3.02h4.438l-.709 4.653h-3.728V32c7.649-1.208 13.5-7.867 13.5-15.902z"/></svg>
          </div>
          <span class="material-icons nsw-material-icons" focusable="false" aria-hidden="true">east</span>
        </div>
      </div>
    </div>`),t=document.createElement("div");t.classList.add("nsw-grid"),t.innerHTML=s.join(""),e.textContent="",e.append(t)}async function g(o){o.classList.add("facebook-feed");const e=document.createElement("div");e.classList.add("nsw-grid"),e.innerHTML=`<div class="nsw-col nsw-col-md-12">
    <p>Loading Facebook posts...</p>
  </div>`,o.textContent="",o.append(e),await p()}export{g as default};
//# sourceMappingURL=facebook-feed.js.map
