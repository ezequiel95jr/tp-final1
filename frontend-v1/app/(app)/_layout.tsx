import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#8c8c8cff" />

      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
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
      </SafeAreaView>
    </>
  );
}
