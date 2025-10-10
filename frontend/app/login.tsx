import React, { useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import api from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Button from "../components/Button"; 


export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

const handleLogin = async () => {
  try {
    const response = await api.post("/login", { email, password });
    const token = response.data.token;
    await AsyncStorage.setItem("userToken", token);  
    navigation.replace("Home"); 
  } catch (error: any) {
    Alert.alert("Error", error.response?.data?.message || "No se pudo iniciar sesión");
  }
};

  return (
    <View style={{ flex:1, justifyContent:"center", padding:20 }}>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} style={{ borderWidth:1, marginBottom:10, padding:5 }} />
      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth:1, marginBottom:10, padding:5 }} />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Registrarse" onPress={() => navigation.navigate("Register")} />
    </View>
  );
}
