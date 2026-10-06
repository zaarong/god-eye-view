import { setStreetView } from "./streetview-panorama.mjs";
import { headingName } from "./streetview-headings.mjs";
import { osmTileUrl, lon2tile, lat2tile } from "./sat-ortho.mjs";
import { setMode, status } from "./scenePresentation.js";
import { bindKeyboard } from "./surfaceKeyboard.js";
import { saveState, loadState } from "./shareRestoration.js";

const sat = document.querySelector("#satellite");
const street = document.querySelector("#street");
const coords = document.querySelector("#coords");
const headingEl = document.querySelector("#heading");
const statusEl = document.querySelector("#status");
const address = document.querySelector("#address");
let state = loadState() || {lat:48.8566,lon:2.3522,zoom:15,heading:0,mode:"satellite"};

function render(){
  coords.textContent=`${state.lat.toFixed(5)}, ${state.lon.toFixed(5)}`;
  headingEl.textContent=`${Math.round(state.heading)}° ${headingName(state.heading)}`;
  document.querySelector("#zoom").value=state.zoom;
  setMode(document.querySelector(".scene"),state.mode);
  if(state.mode === "street") setStreetView(street,state.lat,state.lon,state.heading);
  drawMap();
  saveState(state);
}
function drawMap(){
  sat.innerHTML="";
  const z=state.zoom, n=2**z;
  const x=lon2tile(state.lon,z), y=lat2tile(state.lat,z);
  for(let dy=-1;dy<=1;dy++) for(let dx=-1;dx<=1;dx++){
    const xx=(x+dx+n)%n, yy=y+dy;
    if(yy<0||yy>=n) continue;
    const img=document.createElement("img");
    img.className="tile"; img.src=osmTileUrl(z,xx,yy);
    img.style.left=`${(dx+1)*256}px`; img.style.top=`${(dy+1)*256}px`;
    sat.appendChild(img);
  }
  const scale=256;
  const px=(state.lon+180)/360*n*scale;
  const r=state.lat*Math.PI/180;
  const py=(1-Math.asinh(Math.tan(r))/Math.PI)/2*n*scale;
  sat.querySelectorAll(".tile").forEach((img,i)=>{
    const dx=(i%3)-1,dy=Math.floor(i/3)-1;
    img.style.left=`calc(50% + ${(dx*256)-(px-Math.floor(px/256)*256)}px)`;
    img.style.top=`calc(50% + ${(dy*256)-(py-Math.floor(py/256)*256)}px)`;
  });
}
function move(key){
  const step=0.0015*Math.pow(2,15-state.zoom);
  if(key==="ArrowUp") state.lat+=step;
  if(key==="ArrowDown") state.lat-=step;
  if(key==="ArrowLeft") state.lon-=step;
  if(key==="ArrowRight") state.lon+=step;
  status(statusEl,"Position mise à jour"); render();
}
document.querySelectorAll(".mode").forEach(b=>b.onclick=()=>{
  state.mode=b.dataset.mode; render();
});
document.querySelectorAll("[data-key]").forEach(b=>b.onclick=()=>move(b.dataset.key));
bindKeyboard(move);
document.querySelector("#zoom").oninput=e=>{state.zoom=+e.target.value;render();};
document.querySelector("#locateBtn").onclick=()=>{
  if(!navigator.geolocation){status(statusEl,"Géolocalisation indisponible");return}
  navigator.geolocation.getCurrentPosition(p=>{
    state.lat=p.coords.latitude; state.lon=p.coords.longitude;
    status(statusEl,"Position trouvée"); render();
  },()=>status(statusEl,"Position refusée"));
};
document.querySelector("#searchBtn").onclick=async()=>{
  const q=address.value.trim(); if(!q)return;
  status(statusEl,"Recherche…");
  try{
    const r=await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`,{headers:{"Accept-Language":"fr"}});
    const a=await r.json();
    if(!a[0]) throw Error();
    state.lat=+a[0].lat; state.lon=+a[0].lon;
    status(statusEl,a[0].display_name); render();
  }catch{status(statusEl,"Lieu introuvable");}
};
sat.addEventListener("click",e=>{
  const rect=sat.getBoundingClientRect();
  const dx=e.clientX-rect.left-rect.width/2, dy=e.clientY-rect.top-rect.height/2;
  const scale=360/(256*2**state.zoom);
  state.lon+=dx*scale; state.lat-=dy*scale;
  render();
});
render();
