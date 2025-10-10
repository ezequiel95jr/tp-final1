import React from "react";
import { View, Text } from "react-native";
import Button from "../Button";

export default function CommentItem({
  c,
  canDelete,
  onDelete,
}: {
  c: { id:number; content:string; created_at:string; user?:{name?:string} };
  canDelete: boolean;
  onDelete: (id:number)=>void;
}) {
  const date = new Date(c.created_at);
  const when = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

  return (
    <View style={{ paddingVertical:10, borderBottomWidth:1, borderBottomColor:"#eee" }}>
      <Text style={{ fontWeight:"700" }}>{c.user?.name ?? "Anónimo"}</Text>
      <Text style={{ color:"#666", fontSize:12, marginBottom:6 }}>{when}</Text>
      <Text>{c.content}</Text>
      {canDelete && (
        <View style={{ marginTop:8 }}>
          <Button title="Eliminar" color="#ef4444" onPress={() => onDelete(c.id)} />
        </View>
      )}
    </View>
  );
}
