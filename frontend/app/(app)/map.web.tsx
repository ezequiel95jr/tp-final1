import React, { useEffect, useRef, useState } from "react";
import { getMarkers } from "../../api/api";

export default function MapWeb() {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [region, setRegion] = useState<{lat:number;lng:number} | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const TOKEN = "PON_TU_TOKEN_ACÁ";

  useEffect(() => {
    const s1 = document.createElement("link");
    s1.rel = "stylesheet";
    s1.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    const s2 = document.createElement("script");
    s2.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    s2.onload = () => setReady(true);
    document.head.appendChild(s1);
    document.body.appendChild(s2);
    return () => { s1.remove(); s2.remove(); };
  }, []);

  useEffect(() => {
    (async () => {
      setRegion({ lat: -38.9517, lng: -68.0591 });
      try {
        const data = await getMarkers(TOKEN);
        setMarkers(data);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    if (!ready || !ref.current || !region || !(window as any).L) return;
    const L = (window as any).L;
    const map = L.map(ref.current).setView([region.lat, region.lng], 14);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
    markers.forEach((m:any) => {
      const mk = L.marker([Number(m.lat), Number(m.lng)]).addTo(map);
      const txt = (m.title||"") + (m.description? ("<br/>"+m.description):"");
      if (txt) mk.bindPopup(txt);
    });
    return () => map.remove();
  }, [ready, region, markers]);

  return <div style={{height:"100vh", width:"100vw"}} ref={ref} />;
}
