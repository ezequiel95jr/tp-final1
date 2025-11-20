import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function AppLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#8c8c8cff" />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#1c1c1c" },
        }}
      >
        <Stack.Screen name="home" />
        <Stack.Screen name="crearpost" />
        <Stack.Screen name="detailPost" />
        <Stack.Screen name="ProfileScreen" />
        <Stack.Screen name="map" />
      </Stack>
    </>
  );
}
