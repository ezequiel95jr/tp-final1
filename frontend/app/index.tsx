import { useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        router.replace('/(app)/home' as any);
      } else {
        router.replace('/(auth)/login' as any);
      }
    })();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator />
    </View>
  );
}
