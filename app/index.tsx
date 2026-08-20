import { View } from "react-native";
import { Stack } from "expo-router";
import Login from "./auth/login";
// import Index from "./auth/login";

export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Login/>
    </View>
  );
}
