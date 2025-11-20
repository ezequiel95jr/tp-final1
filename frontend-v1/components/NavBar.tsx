import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";

export default function BottomNavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    {name: "Mapa", route: "/map" },
    { name: "Feed", route: "/home" },
    { name: "Crear Post", route: "/crearpost" },
    { name: "Perfil", route: "/ProfileScreen" },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.route;
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => router.push(tab.route as any)}
            style={[styles.tab, isActive && styles.activeTab]}
          >
            <Text style={[styles.text, isActive && styles.activeText]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#1e1e1e", 
    borderTopWidth: 1,
    borderColor: "#2e2e2e",
    paddingVertical: 12,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 6,
    elevation: 10,
  },
  tab: {
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e0e0e0", 
  },
  activeText: {
    color: "#cdff4fff", 
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: "#cdff4fff", 
  },
});
