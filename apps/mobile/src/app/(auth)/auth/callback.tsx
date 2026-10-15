"use client";

// OAuth callback route - handles deep links from OAuth flow
// Route: aivo://auth/callback?token=xxx&userId=xxx

import { useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import * as Linking from "expo-linking";
import { authClient } from "@/features/auth/services";
import { useAuth } from "@/features/auth/contexts/auth-context";

export default function OAuthCallback() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      // Get the URL that opened this screen
      const url = await Linking.getInitialURL();
      
      if (url) {
        const parsed = Linking.parse(url);
        
        if (parsed.queryParams?.token && parsed.queryParams?.userId) {
          const token = parsed.queryParams.token as string;
          const userId = parsed.queryParams.userId as string;
          
          console.log("OAuth callback - storing token and refreshing");
          
          // Store token and userId
          await authClient.setToken(token);
          await authClient.setUserId(userId);
          
          // Refresh auth state
          await refreshUser();
          
          // Navigate to home
          router.replace("/(tabs)/home");
        } else {
          // No token - OAuth failed
          console.log("OAuth callback - no token");
          router.replace("/(auth)/login");
        }
      } else {
        router.replace("/(auth)/login");
      }
    };

    handleCallback();
  }, [router, refreshUser]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#087A55" />
      <Text style={styles.text}>Completing sign in...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FCFDFB",
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: "#667085",
  },
});
