export function bindKeyboard(onKey){
  window.addEventListener("keydown", e=>{
    if(["INPUT","TEXTAREA"].includes(document.activeElement?.tagName)) return;
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)){
      e.preventDefault(); onKey(e.key);
    }
  });
}
