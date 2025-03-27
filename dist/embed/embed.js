const d=e=>`<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="${e.href}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" allowfullscreen=""
        scrolling="no" allow="encrypted-media" title="Content from ${e.hostname}" loading="lazy">
      </iframe>
    </div>`,c=e=>`<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe 
        src="${e.href}"
        class="embed-map-iframe"
        style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade">
      </iframe>
    </div>`,m=(e,i)=>{const n=new URLSearchParams(e.search),t=i?"&muted=1&autoplay=1":"";let o=n.get("v")?encodeURIComponent(n.get("v")):"";const s=e.pathname;return e.origin.includes("youtu.be")&&([,o]=e.pathname.split("/")),`<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://www.youtube.com${o?`/embed/${o}?rel=0&v=${o}${t}`:s}" style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" 
      allow="autoplay; fullscreen; picture-in-picture; encrypted-media; accelerometer; gyroscope; picture-in-picture" allowfullscreen="" scrolling="no" title="Content from Youtube" loading="lazy"></iframe>
    </div>`},p=(e,i)=>{const[,n]=e.pathname.split("/");return`<div style="left: 0; width: 100%; height: 0; position: relative; padding-bottom: 56.25%;">
      <iframe src="https://player.vimeo.com/video/${n}${i?"?muted=1&autoplay=1":""}" 
      style="border: 0; top: 0; left: 0; width: 100%; height: 100%; position: absolute;" 
      frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen  
      title="Content from Vimeo" loading="lazy"></iframe>
    </div>`},l=async(e,i,n)=>{if(e.classList.contains("embed-is-loaded"))return;const o=[{match:["google.com/maps","goo.gl/maps","maps.app.goo.gl"],embed:c},{match:["youtube","youtu.be"],embed:m},{match:["vimeo"],embed:p}].find(a=>a.match.some(r=>i.includes(r))),s=new URL(i);o?(e.innerHTML=o.embed(s,n),e.classList=`block embed embed-${o.match[0]}`):(e.innerHTML=d(s),e.classList="block embed"),e.classList.add("embed-is-loaded")};async function u(e){const i=e.querySelector("picture"),n=e.querySelector("a").href;if(e.textContent="",i){const t=document.createElement("div");t.className="embed-placeholder",t.innerHTML='<div class="embed-placeholder-play"><button type="button" title="Play"></button></div>',t.prepend(i),t.addEventListener("click",()=>{l(e,n,!0)}),e.append(t)}else{const t=new IntersectionObserver(o=>{o.some(s=>s.isIntersecting)&&(t.disconnect(),l(e,n))});t.observe(e)}}export{u as default};
//# sourceMappingURL=embed.js.map
