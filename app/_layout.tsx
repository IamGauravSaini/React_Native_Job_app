import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      <Stack.Screen name="auth/forgotPassword" options={{ headerShown: false }} />
      <Stack.Screen name="services/api" options={{ headerShown: false }} />
      <Stack.Screen
        name="auth/signup"
        options={{
          title: "Create Account",
          headerShown: true,
          animation: "slide_from_left",
        }}
      />
    </Stack>
  );
}
