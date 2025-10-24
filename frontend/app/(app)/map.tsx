import { Platform } from "react-native";
import MapWeb from "../../components/maps/map.web";
import MapNative from "../../components/maps/map.native";

export default function Map() {
  const MapComponent = Platform.OS === "web" ? MapWeb : MapNative;
  return <MapComponent />;
}
