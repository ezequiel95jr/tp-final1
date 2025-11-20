import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import CommentItem from "./CommentItem";

export default function CommentList({
  items,
  loading,
  currentUserId,
  postOwnerId,
  onDelete,
}: {
  items: any[];
  loading: boolean;
  currentUserId?: number;
  postOwnerId?: number;
  onDelete: (id:number)=>void;
}) {
  if (loading) {
    return <View style={{ padding:20 }}><ActivityIndicator /><Text>Cargando comentarios…</Text></View>;
  }
  if (!items.length) return <Text>No hay comentarios aún</Text>;

  return (
    <View style={{ marginTop:12 }}>
      {items.map((c) => (
        <CommentItem
          key={c.id}
          c={c}
          canDelete={c.user_id === currentUserId || postOwnerId === currentUserId}
          onDelete={onDelete}
        />
      ))}
    </View>
  );
}
