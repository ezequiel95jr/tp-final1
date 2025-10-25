// frontend/api/index.ts
import axios, { AxiosError } from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router"; // si no usás router acá, podés quitarlo

export const BASE_URL = "http://192.168.1.7:8000/api";
// ⚠️ Cambiá esto si tu IP de PC cambia
const LAN_IP = "192.168.1.47";

// BaseURL por plataforma: web usa localhost; móvil (Expo Go) usa tu IP LAN
const baseURL = Platform.select({
  web: "http://127.0.0.1:8000/api",
  default: `http://${LAN_IP}:8000/api`,
}) as string;

//console.log(`[${Platform.OS}] BASE`, baseURL);

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const bad =
    (config.baseURL && config.baseURL.includes("10.0.2.2")) ||
    (typeof config.url === "string" && config.url.startsWith("http://10.0.2.2"));

  if (bad) {
    console.warn("⚠️ Forzando baseURL (alguien intentó usar 10.0.2.2):", {
      wasBaseURL: config.baseURL,
      wasUrl: config.url,
    });
    config.baseURL = `http://${LAN_IP}:8000/api`;
    if (typeof config.url === "string" && config.url.startsWith("http://10.0.2.2")) {
      try {
        const u = new URL(config.url);
        config.url = u.pathname + u.search; // queda “/login”, etc.
      } catch {}
    }
  }
  return config;
});

// Token en cada request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("userToken");
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError<any>) => {
    console.log("AXIOS ERROR ===>", {
      message: err.message,
      code: err.code,
      status: err.response?.status,
      data: err.response?.data,
      url: err.config?.baseURL + (err.config?.url ?? ""),
      method: err.config?.method,
    });

    if (err.response?.status === 401) {
      await AsyncStorage.removeItem("userToken");
      try {
        router.replace("/(auth)/login");
      } catch {}
    }
    return Promise.reject(err);
  }
);

export const getMarkers = async () => {
  const response = await fetch("http://192.168.1.47:8000/api/markers");
  return await response.json();
};


export default api;
