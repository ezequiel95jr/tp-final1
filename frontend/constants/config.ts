import { Platform } from "react-native";

const LOCAL_IP = "192.168.1.6"; // 👈 si cambia, solo se toca acá

// Fallbacks locales o por entorno
const WEB_BASE =
  process.env.EXPO_PUBLIC_API_WEB_BASE_URL ?? "http://127.0.0.1:8000/api";
const NATIVE_BASE =
  process.env.EXPO_PUBLIC_API_NATIVE_BASE_URL ?? `http://${LOCAL_IP}:8000/api`;

const WEB_ORIGIN =
  process.env.EXPO_PUBLIC_WEB_ORIGIN ?? "http://127.0.0.1:8000";
const NATIVE_ORIGIN =
  process.env.EXPO_PUBLIC_NATIVE_ORIGIN ?? `http://${LOCAL_IP}:8000`;

// ✅ Selección según plataforma
export const API_BASE_URL = Platform.select({
  web: WEB_BASE,
  default: NATIVE_BASE,
}) as string;

export const API_ORIGIN = Platform.select({
  web: WEB_ORIGIN,
  default: NATIVE_ORIGIN,
}) as string;

export const GOOGLE_MAPS_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

// 🔗 Utilidad para construir rutas API
export function apiPath(path: string) {
  const base = API_BASE_URL.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export function buildImageUrl(path: string) {
  const origin = API_ORIGIN.replace(/\/+$/, "");
  const cleanPath = path.replace(/^\/+/, "");
  return `${origin}/${cleanPath}`;
}
