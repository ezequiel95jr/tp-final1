import { Platform } from "react-native";

// Public env vars are embedded at build time by Expo.
// Provide sensible fallbacks for local development.
const WEB_BASE = process.env.EXPO_PUBLIC_API_WEB_BASE_URL ?? "http://127.0.0.1:8000/api";
const NATIVE_BASE = process.env.EXPO_PUBLIC_API_NATIVE_BASE_URL ?? "http://192.168.1.47:8000/api";

const WEB_ORIGIN = process.env.EXPO_PUBLIC_WEB_ORIGIN ?? "http://127.0.0.1:8000";
const NATIVE_ORIGIN = process.env.EXPO_PUBLIC_NATIVE_ORIGIN ?? "http://192.168.1.47:8000";

export const API_BASE_URL = Platform.select({ web: WEB_BASE, default: NATIVE_BASE }) as string;
export const API_ORIGIN = Platform.select({ web: WEB_ORIGIN, default: NATIVE_ORIGIN }) as string;

export const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";


export function apiPath(path: string) {
  const base = API_BASE_URL.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

