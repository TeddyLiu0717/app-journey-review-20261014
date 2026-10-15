"use strict";
const buttons=[...document.querySelectorAll("[data-mode]")];
function setMode(mode){document.body.classList.toggle("text-mode",mode==="text");buttons.forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.mode===mode)));document.querySelectorAll("details.text-source").forEach(d=>d.open=mode==="text");if(mode==="text")document.querySelectorAll("video").forEach(v=>v.pause());}
buttons.forEach(b=>b.addEventListener("click",()=>setMode(b.dataset.mode)));
if(new URLSearchParams(location.search).get("text")==="1")setMode("text");
document.addEventListener("play",e=>{if(e.target.tagName==="VIDEO")document.querySelectorAll("video").forEach(v=>{if(v!==e.target)v.pause()})},true);
function openEvidence(){if(!location.hash.startsWith("#ev-"))return;const target=document.getElementById(location.hash.slice(1));if(!target)return;setMode("visual");for(let p=target.parentElement;p;p=p.parentElement)if(p.tagName==="DETAILS")p.open=true;target.scrollIntoView({block:"start",behavior:"instant"});}
addEventListener("hashchange",openEvidence);openEvidence();
