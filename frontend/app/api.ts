// api.ts
import axios, { AxiosError } from "axios";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import type { Href } from "expo-router";

let baseURL = "";
if (Platform.OS === "web") {
  baseURL = "http://127.0.0.1:8000/api";
} else if (Platform.OS === "android") {
  baseURL = "http://10.0.2.2:8000/api";
} else {
  // iOS dispositivo físico: cambiá por tu IP local
  baseURL = "http://192.168.1.100:8000/api";
}

const api = axios.create({
  baseURL,
  timeout: 10000,
});

// Agrega el token en cada request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("userToken");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Maneja 401 globalmente
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<any>) => {
    const status = error.response?.status;
    if (status === 401) {
      await AsyncStorage.removeItem("userToken");
      // Redirige a login y evita volver atrás
      router.replace("/(auth)/login" as Href);
    }
    return Promise.reject(error);
  }
);

export default api;
