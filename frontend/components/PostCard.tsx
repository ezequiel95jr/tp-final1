import React from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';

export type Post = {
  id: number;
  title: string;
  body?: string;
  content?: string;
  category_id?: number;
  state_id?: number;
  created_at?: string;
  category?: { id: number; name: string };
  state?: { id: number; name: string };
  type?: string;
};

function excerpt(t?: string, n = 120) {
  if (!t) return '';
  const s = t.trim().replace(/\s+/g, ' ');
  return s.length > n ? s.slice(0, n) + '…' : s;
}

export default function PostCard({
  item,
  onPress,
}: {
  item: Post;
  onPress: () => void;
}) {
  const body = item.content ?? item.body ?? '';

  return (
    <Pressable onPress={onPress} style={styles.card} accessibilityRole="button">
      <Text style={styles.title}>{item.title}</Text>
      {!!body && <Text style={styles.body}>{excerpt(body)}</Text>}

      <View style={styles.metaRow}>
        {!!item.category?.name && (
          <Text style={[styles.badge, styles.badgeSpacing]}>#{item.category.name}</Text>
        )}
        {!!item.type && <Text style={[styles.badge, styles.badgeSpacing]}>{item.type}</Text>}
        {!!item.created_at && (
          <Text style={[styles.date, styles.badgeSpacing]}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 6 },
  body: { color: '#374151' },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  badgeSpacing: { marginRight: 8, marginBottom: 6 }, // reemplaza gap
  badge: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: '#eef2ff',
    color: '#3730a3',
  },
  date: { marginLeft: 'auto', fontSize: 12, color: '#6b7280' },
});
