export const headings = ["N","NE","E","SE","S","SW","W","NW"];
export function headingName(deg) {
  const d = ((deg % 360) + 360) % 360;
  return headings[Math.round(d / 45) % 8];
}
