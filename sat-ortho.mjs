export function osmTileUrl(z,x,y){
  return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
}
export function lon2tile(lon,z){ return Math.floor((lon+180)/360*Math.pow(2,z)); }
export function lat2tile(lat,z){
  const r=lat*Math.PI/180;
  return Math.floor((1-Math.asinh(Math.tan(r))/Math.PI)/2*Math.pow(2,z));
}
export function addTile(layer,z,x,y,src){
  const img=document.createElement("img");
  img.className="tile"; img.src=src; img.alt="";
  const n=Math.pow(2,z);
  img.style.left=`${(x % n)*256}px`;
  img.style.top=`${y*256}px`;
  layer.appendChild(img); return img;
}
