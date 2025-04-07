/* empty css                      */import{g as i}from"../chunks/aem-DzghdSH4.js";const r="facebookapi",l="/src/blocks/facebook-feed/fbApi.json",d={headers:{Authorization:"Bearer ZmFjZWJvb2stc3dzLWF1dGhvcml6ZXItc3dzLWNsb3VkOktlbm5ldGhTV1M=","Content-Type":"application/json"}};async function h(){const t=window.location.hostname==="localhost";try{const s=await i();return t&&(!s||!s[r])?l:s[r]}catch(s){console.error("Error fetching placeholders:",s);return}}async function f(){const t=await h();if(!t)return null;try{const s=await fetch(t,{method:"GET",...d});if(!s.ok)throw new Error(`Facebook API request failed: ${s.statusText}`);const e=await s.json();if(!e||!e.length||!e[0].posts)throw new Error("No Facebook posts found");const a=JSON.parse(e[0].posts),o=[];for(let c=0;c<a.length;c+=1){const n=a[c];if(n.full_picture&&n.message&&(o.push(n),o.length===3))break}return o}catch(s){return console.error("Error fetching Facebook API:",s),null}}async function u(t){const e=(await f()).map(o=>`<div class = 'nsw-col nsw-col-md-6 nsw-col-lg-4'>
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
    </div>`),a=document.createElement("div");a.classList.add("nsw-grid"),a.innerHTML=e.join(""),t.textContent="",t.append(a)}export{u as default};
//# sourceMappingURL=facebook-feed.js.map
