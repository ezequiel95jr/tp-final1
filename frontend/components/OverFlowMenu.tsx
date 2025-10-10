// components/OverflowMenu.tsx
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Modal, TouchableWithoutFeedback } from "react-native";

type Props = {
  items: { label: string; onPress: () => void }[];
};

export default function OverflowMenu({ items }: Props) {
  const [open, setOpen] = useState(false);

  const handleSelect = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <View style={styles.wrapper}>
      {/* Botón 3 puntitos */}
      <Pressable onPress={() => setOpen(true)} style={styles.trigger}>
        <Text style={styles.triggerText}>⋮</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        {/* Tocar fuera cierra */}
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        {/* Panel del menú, anclado arriba a la derecha */}
        <View style={styles.menuContainer}>
          <View style={styles.menu}>
            {items.map((it, idx) => (
              <Pressable
                key={idx}
                style={({ pressed }) => [styles.menuItem, pressed && { backgroundColor: "#f3f4f6" }]}
                onPress={() => handleSelect(it.onPress)}
              >
                <Text style={styles.menuItemText}>{it.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { justifyContent: "center", alignItems: "flex-end" },
  trigger: { paddingHorizontal: 8, paddingVertical: 4 },
  triggerText: { fontSize: 22, lineHeight: 22 },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.0)", // transparente para que se vea la lista
  },

  menuContainer: {
    position: "absolute",
    top: 48,   // ajustá según tu header
    right: 12, // alineado al borde derecho
  },
  menu: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    minWidth: 170,
    paddingVertical: 6,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  menuItem: { paddingVertical: 10, paddingHorizontal: 12 },
  menuItemText: { fontSize: 15, fontWeight: "600" },
});
