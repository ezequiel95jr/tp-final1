// frontend/api/api.ts
import axios, { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { API_BASE_URL, apiPath } from "../constants/config";

const api = axios.create({
  baseURL: API_BASE_URL,
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
    console.warn("Forzando baseURL por 10.0.2.2 detectado:", {
      wasBaseURL: config.baseURL,
      wasUrl: config.url,
    });
    config.baseURL = API_BASE_URL;
    if (typeof config.url === "string" && config.url.startsWith("http://10.0.2.2")) {
      try {
        const u = new URL(config.url);
        config.url = u.pathname + u.search; // usar ruta relativa
      } catch {}
    }
  }
  return config;
});

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
  const response = await fetch(apiPath("/markers"));
  return await response.json();
};

export default api;

