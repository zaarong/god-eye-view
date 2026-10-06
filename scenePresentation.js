export function setMode(root, mode){
  root.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  root.querySelector(`#${mode}`).classList.add("active");
  root.querySelectorAll(".mode").forEach(b=>b.classList.toggle("active",b.dataset.mode===mode));
}
export function status(el,text){ el.textContent=text; }
