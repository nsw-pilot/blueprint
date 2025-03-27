import{g as c}from"./aem-CkpPMh2a.js";import{I as d}from"./main-DgXrYfkD.js";const i={GTM_ID:"gtmid",GTM_AUTH_PARAMS:"gtmauthparams",GTM_URL:"gtmurl"},l="https://www.googletagmanager.com/ns.html",s="https://www.googletagmanager.com/gtm.js",r={data:null};function m(t,e,a=""){return`
    (function(w, d, s, l, i) {
        w[l] = w[l] || [];
        w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' }); 
        var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s),
            dl = l !== 'dataLayer' ? '&l=' + l : ''; 
        j.async = true;
        j.src = '${`${e}/gtm.js`||s}?id=' + i + dl + '${a}';
        f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', '${t}');
  `}function g(t,e,a=""){const o=document.createElement("noscript"),n=document.createElement("iframe");n.setAttribute("src",`${`${e}/ns.html`||l}?id=${t}${a}`),n.setAttribute("height","0"),n.setAttribute("width","0"),n.style.display="none",n.style.visibility="hidden",o.appendChild(n),document.body.insertAdjacentElement("afterbegin",o)}const p=async()=>{if(d)return!1;try{r.data||(r.data=await c());const t=r.data[i.GTM_ID],e=r.data[i.GTM_AUTH_PARAMS]||"",a=r.data[i.GTM_URL]||s;if(!t){console.info("GTM ID not provided, skipping GTM initialization");return}const o=document.createElement("script");o.textContent=m(t,a,e),document.head.appendChild(o),g(t,a,e)}catch(t){console.error("Failed to load GTM:",t)}};p();
//# sourceMappingURL=delayed-qsWSOEKH.js.map
