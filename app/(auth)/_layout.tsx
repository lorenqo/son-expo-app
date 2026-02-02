import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: "transparentModal",
        headerShown: false,
        animation: "fade",
        contentStyle: {
          backgroundColor: "#1C0F21",
        },
      }}
    />
  );
}
