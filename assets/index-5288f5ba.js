import{_ as i,S as d}from"./PluginSelecter.vue_vue_type_script_setup_true_lang-b5e9bb3f.js";import{d as u,r as a,c as f,a as c,b as m,o as _}from"./index-f0bca4e0.js";const p={class:"w-full h-full flex flex-col"},h={class:"px-10 pt-8 pb-0"},C=u({__name:"index",setup(v){const s=a(),o=a(!1);async function t(n){const e=document.createElement("div");e.className="w-full h-full";const l=s.value;for(;l.hasChildNodes();)l.removeChild(l.firstChild);l.appendChild(e),await d.embedProject(e,n,{openFile:"README.md",hideExplorer:!1,showSidebar:!0}),o.value=!0}function r(){s.value.requestFullscreen()}return(n,e)=>(_(),f("div",p,[c("div",h,[m(i,{"on-submit":t,"fullscreen-enable":o.value,init:!0,onFullscreen:r},null,8,["fullscreen-enable"])]),c("div",{ref_key:"codeRef",ref:s,class:"flex-1 h-0"},null,512)]))}});export{C as default};
//# sourceMappingURL=index-5288f5ba.js.map