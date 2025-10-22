import { Stack } from "expo-router";
import { View, StatusBar } from "react-native";

export default function AppLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#1c1c1c" }}>
      <StatusBar barStyle="light-content" backgroundColor="#8c8c8cff" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#313131ff" }, // fondo en todas las pantallas
        }}
      >
        <Stack.Screen name="home" />
        <Stack.Screen name="crearpost" />
        <Stack.Screen name="detailPost" />
      </Stack>
    </View>
  );
}
