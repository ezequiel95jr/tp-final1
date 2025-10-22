import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";

export default function BottomNavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { name: "Feed", route: "/" },
    { name: "Crear Post", route: "/crearpost" },
    { name: "Perfil", route: "/perfil" },
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
    backgroundColor: "#343434ff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 12,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 7,
  },
  tab: {
    alignItems: "center",
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffffff",
  },
  activeText: {
    color: "#afaa4cff",
    fontWeight: "bold",
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: "#4CAF50",
  },
});



