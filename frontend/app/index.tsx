import { useEffect } from "react";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator, StyleSheet, Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";

export default function Index() {
  useEffect(() => {
    const checkTokenAndRedirect = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          router.replace("/(app)/home");
        } else {
          router.replace("/(auth)/login");
        }
      } catch (error) {
        console.error("Error leyendo token:", error);
      }
    };

    checkTokenAndRedirect();

    
    if (Platform.OS === "android") {
      NavigationBar.setBehaviorAsync("inset-swipe");
      NavigationBar.setBackgroundColorAsync("#000000");
      NavigationBar.setButtonStyleAsync("dark");
    }
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000", 
});
