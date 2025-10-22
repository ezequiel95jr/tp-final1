import axios from "axios";
import { Platform } from "react-native";

let baseURL = "";

if (Platform.OS === "web") {
  baseURL = "http://127.0.0.1:8000/api"; // Laravel corriendo local
} else if (Platform.OS === "android") {
  baseURL = "http://10.0.2.2:8000/api"; // emulador Android
} else {
  baseURL = "http://192.168.1.100/api"; // IP de tu celular físico
}

const api = axios.create({ baseURL });

export default api;