import React, { useState } from "react";
import { View, TextInput } from "react-native";
import Button from "../Button";

export default function CommentInput({ onSubmit }: { onSubmit: (text: string) => Promise<void> | void }) {
  const [text, setText] = useState("");
  const handle = async () => {
    if (!text.trim()) return;
    await onSubmit(text.trim());
    setText("");
  };
  return (
    <View style={{ gap: 8 }}>
      <TextInput
        placeholder="Escribe un comentario…"
        value={text}
        onChangeText={setText}
        style={{ borderWidth:1, borderColor:"#ccc", borderRadius:6, padding:10 }}
      />
      <Button title="Comentar" onPress={handle} />
    </View>
  );
}
