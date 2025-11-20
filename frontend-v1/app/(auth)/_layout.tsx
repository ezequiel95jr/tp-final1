import { View, StatusBar } from "react-native";
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#1c1c1c" }}>
      <StatusBar barStyle="light-content" backgroundColor="#8c8c8cff" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#313131ff" }, // fondo en todas las pantallas
        }}
      >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      </Stack>
    </View>
  );
}




