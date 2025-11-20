  // app/(auth)/login.tsx
  import React, { useState, useEffect } from "react";
  import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, ActivityIndicator, } from "react-native";
  import { router } from "expo-router";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  import api from "../../api/api";
  import * as WebBrowser from "expo-web-browser";
  import * as Google from "expo-auth-session/providers/google";

  WebBrowser.maybeCompleteAuthSession();



    export default function LoginScreen() {
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [loading, setLoading] = useState(false);

      const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: "1057987267691-9teg34ut22ioop9u3ppgn9lqtkhi5rbu.apps.googleusercontent.com",
        webClientId: "1057987267691-e0vs7jm74ofo6ou9ivn75p77mbhllmrt.apps.googleusercontent.com",
      },

      );


    useEffect(() => {
      if (response?.type === "success") {

        const idToken =
          response.params?.id_token ??
          response.params?.access_token ??
          response.authentication?.idToken ??
          response.authentication?.accessToken;

        if (!idToken) {
          console.warn("No se recibió id_token ni access_token de Google");
          console.log("Respuesta completa ===>", response);
          Alert.alert(
            "Error",
            "No se pudo obtener el token de Google. Intenta nuevamente."
          );
          return;
        }

        console.log("TOKEN DE GOOGLE ===>", idToken);
        handleGoogleLogin(idToken);
      }
    }, [response]);



    const handleLogin = async () => {
      if (!email || !password) {
        Alert.alert("Completa todos los campos");
        return;
      }

      setLoading(true);
      try {
        const res = await api.post("/login", { email, password });
        const token = res.data?.token;
        const user = res.data?.user;

        if (!token) {
          Alert.alert("Error", "El backend no devolvió token");
          return;
        }

        await AsyncStorage.setItem("userToken", token);
        await AsyncStorage.setItem("userId", String(user.id));
        await AsyncStorage.setItem("userName", user.name);
        await AsyncStorage.setItem("userEmail", user.email);
        if (user.image) await AsyncStorage.setItem("userImage", user.image);
        router.replace("/home");
      } catch (err: any) {
        console.log("LOGIN ERR ->", err?.response?.data || err?.message);
        Alert.alert("Error", err?.response?.data?.message || "No se pudo iniciar sesión");
      } finally {
        setLoading(false);
      }
    };

    const handleGoogleLogin = async (idToken: string) => {
      try {
        setLoading(true);
        const res = await api.post("/google-login", { id_token: idToken });
        const token = res.data?.token;
        const user = res.data?.user;

        if (!token) {
          Alert.alert("Error", "El backend no devolvió token de Google");
          return;
        }

        await AsyncStorage.setItem("userToken", token);
        await AsyncStorage.setItem("userId", String(user.id));
        router.replace("/home");
      } catch (err: any) {
        console.log("Error Google Login ->", err?.response?.data || err?.message);
        Alert.alert("Error", "No se pudo iniciar sesión con Google");
      } finally {
        setLoading(false);
      }
    };

    return (
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.title}>Iniciar Sesión</Text>

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            placeholder="correo@ejemplo.com"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#999"
          />

          {loading ? (
            <ActivityIndicator size="large" color="#4f9cff" style={{ marginVertical: 10 }} />
          ) : (
            <>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.loginButton]}
                  onPress={handleLogin}
                >
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.registerButton]}
                  onPress={() => router.push("/register")}
                >
                  <Text style={styles.buttonText}>Registrarse</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.button, styles.googleButton]}
                onPress={() => promptAsync()}
                disabled={!request}
              >
                <Text style={styles.buttonText}>Sign In with Google</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#1c1c1c",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
    },
    box: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: "#2a2a2a",
      borderRadius: 16,
      padding: 30,
      shadowColor: "#000",
      shadowOpacity: 0.3,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 6,
      elevation: 6,
    },
    title: {
      fontSize: 26,
      fontWeight: "700",
      color: "#fff",
      textAlign: "center",
      marginBottom: 20,
    },
    label: {
      color: "#ccc",
      fontSize: 15,
      marginBottom: 6,
      marginTop: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: "#3a3a3a",
      backgroundColor: "#333",
      borderRadius: 8,
      color: "#fff",
      paddingHorizontal: 10,
      paddingVertical: 8,
      fontSize: 15,
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
      marginTop: 20,
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    loginButton: {
      backgroundColor: "#4f9cff",
    },
    registerButton: {
      backgroundColor: "#3fa36b",
    },
    googleButton: {
      backgroundColor: "#000000ff",
      marginTop: 15,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
      textAlign: "center",
      fontSize: 16,
    },
  });
