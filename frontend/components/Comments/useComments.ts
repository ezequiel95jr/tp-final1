import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api";

export type Comment = {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: string;
  user?: { id: number; name: string };
};

export function useComments(postId: number) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const res = await api.get("/comments", {
        params: { post_id: postId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(res.data ?? []);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  const add = useCallback(async (content: string) => {
    const token = await AsyncStorage.getItem("userToken");
    const res = await api.post(
      "/comments",
      { post_id: postId, content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // prepend
    setComments(prev => [res.data, ...prev]);
  }, [postId]);

  const remove = useCallback(async (id: number) => {
    const token = await AsyncStorage.getItem("userToken");
    await api.delete(`/comments/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setComments(prev => prev.filter(c => c.id !== id));
  }, []);

  return { comments, loading, load, add, remove };
}
