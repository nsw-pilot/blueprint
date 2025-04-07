import{g as c}from"../chunks/aem-DzghdSH4.js";async function i(r,t){let a=(await c()).searchurl;t!==""&&(a+=`&query=+${t}`);let n="<ol>";try{const e=await fetch(a);if(!e.ok)throw new Error(`HTTP error! Status: ${e.status}`);const o=await e.json();if(o.results.length===0){const s=`<div class="nsw-results-bar__info">Sorry, no results found for your search</div>
      <div class="error-message">
        <h4>Didn’t find what you were looking for?</h4>
        <ul>
          <li>Try using different or fewer keywords </li>
          <li>Check your spelling</li>
          <li>Try broader or general search terms</li>
        </ul>
      </div>
      <div class="error-message">
        <h4>Contact us</h4>
        <p>Call 13 33 33 to find your local office or email <a href="mailto:help@customerservice.nsw.gov.au">help@customerservice.nsw.gov.au</a>. </p>
      </div>
      `;r.querySelector(".nsw-search-results").innerHTML=s;return}o.results.forEach(s=>{n+=`<li class='nsw-list-item'>
                        <div class="nsw-list-item__content">
                          <div class="nsw-list-item__title"><a href='${s.url}'>${s.title}</a></div>
                          <div class="nsw-list-item__link">${s.url}</div>
                          <div class="nsw-list-item__copy">${s.content}</div>
                        </div>
                      </li>`})}catch(e){console.error("Error fetching data:",e)}n+="</ol>",r.querySelector(".nsw-search-results").innerHTML=n}async function d(r){var e;const t=document.createElement("div");t.classList="searchlist-container";const a=((e=new URL(window.location.href).searchParams.get("q"))==null?void 0:e.trim())||"",n=`
            <h1> Search </h1>
          <form id="searchForm"><div class="nsw-form__input-group">
          
            <label class="sr-only" for="search-input">Search</label>
            <input class="nsw-form__input" type="text" id="searchInput" name="search-input" value="${a}">
            <button class="nsw-button nsw-button--dark nsw-button--flex" type="submit">Search</button>
          
          </div> </form>
          <div class="nsw-search-results">
          </div>`;t.innerHTML=n,r.append(t),document.getElementById("searchForm").addEventListener("submit",o=>{o.preventDefault();const s=document.getElementById("searchInput").value;i(r,s)}),i(r,a)}export{d as default};
//# sourceMappingURL=search.js.map
