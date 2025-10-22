import { Platform } from "react-native";
import NativeMap from "./map.native";
import WebMap from "./map.web";

export default function MapRoute() {
  return Platform.OS === "web" ? <WebMap /> : <NativeMap />;
}
