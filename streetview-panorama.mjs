export function streetViewUrl(lat, lon, heading=0) {
  const params = new URLSearchParams({
    api: "1",
    map_action: "pano",
    viewpoint: `${lat},${lon}`,
    heading: String(heading),
    pitch: "0",
    fov: "90"
  });
  return `https://www.google.com/maps/@?${params}`;
}
export function setStreetView(iframe, lat, lon, heading=0) {
  iframe.src = streetViewUrl(lat, lon, heading);
}
