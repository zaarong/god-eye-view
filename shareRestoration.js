export function saveState(state){
  localStorage.setItem("gev-state",JSON.stringify(state));
}
export function loadState(){
  try{return JSON.parse(localStorage.getItem("gev-state"))||null}catch{return null}
}
