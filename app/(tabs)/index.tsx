import { useAuth } from "@/store/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ErrorBoundaryProps, useRouter } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      <Text>{error.message}</Text>
      <Text onPress={retry}>Try Again?</Text>
    </View>
  );
}

export default function Index() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    AsyncStorage.getItem("onboardingCompleted").then((value) => {
      if (value !== "true") {
        router.replace("/onboarding");
      } else {
        router.replace("/(tabs)");
      }
    });
  }, []);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Text style={styles.title}>{t("index.title")}</Text>

          <Text style={styles.subtitle}>
            {user
              ? `${t("index.loginedUs")} ${user.name}`
              : t("index.notLogined")}
          </Text>

          <Pressable onPress={() => AsyncStorage.clear()}>
            <Text style={styles.resetText}>RESET STORAGE</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  /** ⬇️ ТОЧНО КАК В DREAMS */
  root: {
    flex: 1,
    minHeight: "100vh" as any,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  /** ⬇️ ТОЧНО КАК В DREAMS */
  safe: {
    flex: 1,
    backgroundColor: "transparent",
  },

  /** ⬇️ ТОЧНО КАК В DREAMS */
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: theme.gap(3),
    paddingVertical: theme.gap(4),
  },

  /** визуал (не влияет на layout) */
  title: {
    color: theme.colors.typography,
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -0.3,
    marginBottom: theme.gap(1.25),
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.dimmed,
    textAlign: "center",
    maxWidth: 280,
    marginBottom: theme.gap(3),
  },

  resetText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.4,
    color: theme.colors.danger,
  },
}));
