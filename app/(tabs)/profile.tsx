import "@/src/i18n";
import { logout } from "@/store/authStore";
import { useAuth } from "@/store/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Image, Platform, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native-unistyles";

export default function Profile() {
  const { user, hydrated } = useAuth();
  const [loginOpen, setLoginOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const apiUrl =
    Platform.OS === "web"
      ? process.env.EXPO_PUBLIC_WEB_API_URL
      : process.env.EXPO_PUBLIC_MOBILE_API_URL;

  const handleLanguageChange = async (language: string) => {
    try {
      const LANGUAGE_KEY = "@app_language";
      await i18n.changeLanguage(language);
      await AsyncStorage.setItem(LANGUAGE_KEY, language);
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  if (!hydrated) return null;

  if (!user) {
    return (
      <View style={styles.root}>
        <SafeAreaView style={styles.safe}>
          <View style={styles.container}>
            <Text style={styles.title}>{t("profile.notLoggedIn")}</Text>

            <Pressable
              style={styles.primaryButton}
              onPress={() => router.push("../login")}
              // onPress={() => setLoginOpen(true)}
            >
              <Text style={styles.primaryButtonText}>{t("profile.login")}</Text>
            </Pressable>

            {/* <Login visible={loginOpen} onClose={() => setLoginOpen(false)} /> */}
          </View>
        </SafeAreaView>
      </View>
    );
  }

  const imageUrl = user.pic
    ? `${apiUrl}/public/images/photo/${user.id}-mini?nocache=${user.pic}`
    : `${apiUrl}/public/images/photo_no_160x200.gif`;

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Image source={{ uri: imageUrl }} style={styles.avatar} />

          <Text style={styles.name}>{user.name}</Text>

          <Text style={styles.balance}>
            {t("profile.balance")}: {user.balance} ₽
          </Text>

          <View style={styles.languageRow}>
            <Pressable onPress={() => handleLanguageChange("en-US")}>
              <Text style={styles.flag}>🇺🇸</Text>
            </Pressable>
            <Pressable onPress={() => handleLanguageChange("ru-RU")}>
              <Text style={styles.flag}>🇷🇺</Text>
            </Pressable>
            <Pressable onPress={() => handleLanguageChange("ua-UA")}>
              <Text style={styles.flag}>🇺🇦</Text>
            </Pressable>
          </View>

          <Pressable onPress={logout}>
            <Text style={styles.logoutText}>{t("profile.logout")}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  /** layout - 1:1 как в Dreams */
  root: {
    flex: 1,
    minHeight: "100vh" as any,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },

  /** layout - 1:1 как в Dreams */
  safe: {
    flex: 1,
    backgroundColor: "transparent",
  },

  /** layout - 1:1 как в Dreams */
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

    paddingHorizontal: theme.gap(3),
    paddingVertical: theme.gap(4),
  },

  /** дальше уже визуальные стили */
  title: {
    color: theme.colors.typography,
    fontSize: 22,
    fontWeight: "600",
    marginBottom: theme.gap(3),
    textAlign: "center",
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: theme.gap(1.5),
  },

  name: {
    color: theme.colors.typography,
    fontSize: 20,
    fontWeight: "600",
    marginBottom: theme.gap(0.5),
  },

  balance: {
    color: theme.colors.dimmed,
    fontSize: 15,
    marginBottom: theme.gap(3),
  },

  languageRow: {
    flexDirection: "row",
    marginBottom: theme.gap(2),
  },

  flag: {
    fontSize: 24,
    marginHorizontal: theme.gap(1),
  },

  primaryButton: {
    paddingHorizontal: theme.gap(3),
    paddingVertical: theme.gap(1.5),
  },

  primaryButtonText: {
    color: theme.colors.tint,
    fontSize: 16,
    fontWeight: "600",
  },

  logoutText: {
    color: theme.colors.danger,
    fontSize: 15,
    fontWeight: "600",
    marginTop: theme.gap(2),
  },
}));
