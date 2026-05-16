import { initCookies } from "@/services/cookies";
import { auth } from "@/services/requests";
import "@/src/i18n";
import { useAuth } from "@/store/useAuth";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import "../global.css";
import { hydrateAuth, logout, syncUser } from "../store/authStore";
import ConnectionGuard from "./ConnectionGuard";

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const { user, hydrated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  async function checkAuth() {
    const res = await auth();
    if (res.user.isGuest) {
      await logout();
    } else {
      await syncUser(res.user);
    }
  }

  useEffect(() => {
    const run = async () => {
      await initCookies();
      await hydrateAuth();
      await checkAuth();
      setReady(true);
    };
    run();
  }, []);

  // Реагируем на изменение auth стейта — когда user появляется
  // и мы всё ещё на (auth) экране, переходим в приложение
  useEffect(() => {
    if (!ready || !hydrated) return;
    const inAuth = segments[0] === "(auth)";
    if (user && inAuth) {
      router.replace("/(tabs)");
    }
  }, [user, hydrated, ready, segments]);

  if (!ready) return null;

  return (
    <ConnectionGuard>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#1C1022" },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="chat" options={{ animation: "fade" }} />
        <Stack.Screen
          name="(auth)"
          options={{
            presentation: "modal",
            animation: "fade",
          }}
        />
      </Stack>
    </ConnectionGuard>
  );
}
