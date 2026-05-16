import { PickerRow } from "@/components/ui/picker-row";
import "@/src/i18n";
import { useScreenAnimation } from "@/hooks/useScreenAnimation";
import { logout } from "@/store/authStore";
import { useAuth } from "@/store/useAuth";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Easing,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image as ExpoImage } from "expo-image";

const LANGUAGES = [
  { value: "ru-RU", label: "Русский" },
  { value: "ua-UA", label: "Українська" },
  { value: "en-US", label: "English" },
];

const TIMEZONES = [
  { value: "Europe/London", label: "Лондон (UTC+0)" },
  { value: "Europe/Kiev", label: "Киев (UTC+2)" },
  { value: "Europe/Moscow", label: "Москва (UTC+3)" },
  { value: "Europe/Minsk", label: "Минск (UTC+3)" },
  { value: "Asia/Dubai", label: "Дубай (UTC+4)" },
  { value: "Asia/Yekaterinburg", label: "Екатеринбург (UTC+5)" },
  { value: "Asia/Novosibirsk", label: "Новосибирск (UTC+7)" },
  { value: "Asia/Vladivostok", label: "Владивосток (UTC+10)" },
  { value: "America/New_York", label: "Нью-Йорк (UTC−5)" },
  { value: "America/Los_Angeles", label: "Лос-Анджелес (UTC−8)" },
];

const CARD_BORDER = { borderWidth: 1, borderColor: "rgba(255,255,255,0.05)" };
const ROW_BORDER = {
  borderBottomWidth: 1,
  borderBottomColor: "rgba(255,255,255,0.05)",
};

function usePressScale(to = 0.96) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () =>
    Animated.spring(scale, {
      toValue: to,
      useNativeDriver: true,
      bounciness: 0,
      speed: 30,
    }).start();
  const pressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      bounciness: 0,
      speed: 30,
    }).start();
  return { scale, pressIn, pressOut };
}

export default function Profile() {
  const { user, hydrated } = useAuth();
  const { t, i18n } = useTranslation();

  const [notifEnabled, setNotifEnabled] = useState(false);
  const [timezone, setTimezone] = useState("Europe/Moscow");

  const fadeOut = useRef(new Animated.Value(0)).current;
  const guestScreen = useScreenAnimation();
  const guestCta = usePressScale(0.96);
  const premiumScale = usePressScale(0.97);
  const exportScale = usePressScale();
  const importScale = usePressScale();
  const privacyScale = usePressScale();
  const logoutScale = usePressScale(0.97);

  useEffect(() => {
    AsyncStorage.getItem("@notifications_enabled").then((val) => {
      setNotifEnabled(val === "true");
    });
    AsyncStorage.getItem("@timezone").then((val) => {
      if (val) setTimezone(val);
    });
  }, []);

  const apiUrl =
    Platform.OS === "web"
      ? process.env.EXPO_PUBLIC_WEB_API_URL
      : process.env.EXPO_PUBLIC_MOBILE_API_URL;

  const handleLanguageChange = async (language: string) => {
    await i18n.changeLanguage(language);
    await AsyncStorage.setItem("@app_language", language);
  };

  const handleTimezoneChange = async (tz: string) => {
    setTimezone(tz);
    await AsyncStorage.setItem("@timezone", tz);
  };

  const handleNotifToggle = async (value: boolean) => {
    if (value) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === "granted") {
        setNotifEnabled(true);
        await AsyncStorage.setItem("@notifications_enabled", "true");
      } else {
        Linking.openSettings();
      }
    } else {
      setNotifEnabled(false);
      await AsyncStorage.setItem("@notifications_enabled", "false");
    }
  };

  const handleLogout = () => {
    Animated.timing(fadeOut, {
      toValue: 1,
      duration: 350,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(async () => {
      await logout();
    });
  };

  if (!hydrated) return null;

  if (!user) {
    return (
      <View style={{ flex: 1, backgroundColor: "#1C1022" }}>
        <Animated.View
          style={{
            flex: 1,
            opacity: guestScreen.opacity,
            transform: [{ translateY: guestScreen.translateY }],
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 32,
          }}
        >
          {/* Hero image — same style as onboarding */}
          <View
            style={{
              width: 260,
              height: 260,
              borderRadius: 32,
              marginBottom: 32,
              shadowColor: "#A60DF2",
              shadowOpacity: 0.35,
              shadowRadius: 24,
              shadowOffset: { width: 0, height: 0 },
              elevation: 10,
            }}
          >
            <ExpoImage
              source={require("../../assets/images/dream-hero.png")}
              contentFit="contain"
              transition={250}
              style={{ width: 260, height: 260, borderRadius: 32 }}
            />
          </View>

          <Text
            style={{
              color: "white",
              fontSize: 26,
              fontWeight: "700",
              textAlign: "center",
              marginBottom: 12,
              letterSpacing: -0.3,
            }}
          >
            {t("profile.heroTitle")}
          </Text>
          <Text
            style={{
              color: "rgba(183,144,203,1)",
              fontSize: 15,
              textAlign: "center",
              lineHeight: 22,
              marginBottom: 40,
              maxWidth: 260,
            }}
          >
            {t("profile.heroSubtitle")}
          </Text>

          <Animated.View
            style={{ transform: [{ scale: guestCta.scale }], width: "100%", maxWidth: 340, alignSelf: "center" }}
          >
            <Pressable
              style={{
                backgroundColor: "#A60DF2",
                borderRadius: 999,
                paddingVertical: 15,
                alignItems: "center",
                shadowColor: "#A60DF2",
                shadowOpacity: 0.35,
                shadowRadius: 12,
                shadowOffset: { width: 0, height: 0 },
                elevation: 8,
              }}
              onPressIn={guestCta.pressIn}
              onPressOut={guestCta.pressOut}
              onPress={() => router.push("../login")}
            >
              <Text style={{ color: "white", fontSize: 16, fontWeight: "600" }}>
                {t("profile.beginJourney")}
              </Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </View>
    );
  }

  const imageUrl = user.pic
    ? `${apiUrl}/public/images/photo/${user.id}-mini?nocache=${user.pic}`
    : `${apiUrl}/public/images/photo_no_160x200.gif`;

  return (
    <View className="flex-1 bg-[#1C1022]">
      <SafeAreaView className="flex-1">
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
          {/* Header */}
          <View className="flex-row items-center justify-center px-4 pt-4 pb-2">
            <Text className="text-xl font-bold text-white">{t("profile.title")}</Text>
          </View>

          <View className="px-4 gap-6 mt-2">
            {/* Profile */}
            <View className="flex-row items-center gap-4 py-2">
              <View className="relative">
                <Image
                  source={{ uri: imageUrl }}
                  style={{ width: 80, height: 80, borderRadius: 40 }}
                />
              </View>
              <View className="flex-1 gap-1">
                <Text className="text-xl font-bold text-white">
                  {user.name}
                </Text>
                <Text className="text-sm text-white/60">{user.email}</Text>
                <View className="bg-white/10 px-2.5 py-0.5 rounded-full self-start mt-1">
                  <Text className="text-xs font-medium text-white/80">
                    {t("profile.freePlan")}
                  </Text>
                </View>
              </View>
            </View>

            {/* Premium card */}
            <LinearGradient
              colors={["#3c2249", "#2b1834"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ borderRadius: 12, padding: 20, overflow: "hidden" }}
            >
              <View className="flex-row items-center gap-2 mb-1">
                <Ionicons name="flash" size={18} color="#A60DF2" />
                <Text className="text-white font-bold text-base">
                  Dream Premium
                </Text>
              </View>
              <Text className="text-white/70 text-sm mb-4 leading-[20px]">
                {t("profile.premiumDesc")}
              </Text>
              <Animated.View
                style={[
                  { alignSelf: "flex-start" },
                  { transform: [{ scale: premiumScale.scale }] },
                ]}
              >
                <Pressable
                  className="flex-row items-center gap-2 bg-[#A60DF2] py-2.5 px-5 rounded-full"
                  style={{
                    shadowColor: "#A60DF2",
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 6,
                  }}
                  onPressIn={premiumScale.pressIn}
                  onPressOut={premiumScale.pressOut}
                >
                  <Text className="text-white text-sm font-semibold">
                    {t("profile.upgrade")}
                  </Text>
                  <Ionicons name="arrow-forward" size={14} color="white" />
                </Pressable>
              </Animated.View>
            </LinearGradient>

            {/* Preferences */}
            <View className="gap-2">
              <Text className="px-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                {t("profile.preferences")}
              </Text>
              <View
                className="bg-[#2B1834] rounded-xl overflow-hidden"
                style={CARD_BORDER}
              >
                <PickerRow
                  icon="earth-outline"
                  iconColor="#A60DF2"
                  iconBgClass="bg-[#A60DF2]/10"
                  label={t("profile.language")}
                  value={i18n.language}
                  items={LANGUAGES}
                  onSelect={handleLanguageChange}
                />
                <PickerRow
                  icon="time-outline"
                  iconColor="#A60DF2"
                  iconBgClass="bg-[#A60DF2]/10"
                  label={t("profile.timezone")}
                  value={timezone}
                  items={TIMEZONES}
                  onSelect={handleTimezoneChange}
                />
                {/* Notifications */}
                <View className="flex-row items-center justify-between p-4">
                  <View className="flex-row items-center gap-4">
                    <View className="w-10 h-10 rounded-lg bg-[#A60DF2]/10 items-center justify-center">
                      <Ionicons
                        name="notifications-outline"
                        size={20}
                        color="#A60DF2"
                      />
                    </View>
                    <Text className="text-base font-medium text-white">
                      {t("profile.notifications")}
                    </Text>
                  </View>
                  <Switch
                    value={notifEnabled}
                    onValueChange={handleNotifToggle}
                    trackColor={{
                      false: "rgba(255,255,255,0.1)",
                      true: "#A60DF2",
                    }}
                    thumbColor="white"
                  />
                </View>
              </View>
            </View>

            {/* Data & Privacy */}
            <View className="gap-2">
              <Text className="px-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                {t("profile.dataPrivacy")}
              </Text>
              <View
                className="bg-[#2B1834] rounded-xl overflow-hidden"
                style={CARD_BORDER}
              >
                <Animated.View
                  style={{ transform: [{ scale: exportScale.scale }] }}
                >
                  <Pressable
                    className="flex-row items-center justify-between p-4"
                    style={ROW_BORDER}
                    onPressIn={exportScale.pressIn}
                    onPressOut={exportScale.pressOut}
                  >
                    <View className="flex-row items-center gap-4">
                      <View className="w-10 h-10 rounded-lg bg-blue-500/10 items-center justify-center">
                        <Ionicons
                          name="download-outline"
                          size={20}
                          color="#3b82f6"
                        />
                      </View>
                      <Text className="text-base font-medium text-white">
                        {t("profile.exportJournal")}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color="rgba(255,255,255,0.3)"
                    />
                  </Pressable>
                </Animated.View>

                <Animated.View
                  style={{ transform: [{ scale: importScale.scale }] }}
                >
                  <Pressable
                    className="flex-row items-center justify-between p-4"
                    style={ROW_BORDER}
                    onPressIn={importScale.pressIn}
                    onPressOut={importScale.pressOut}
                  >
                    <View className="flex-row items-center gap-4">
                      <View className="w-10 h-10 rounded-lg bg-blue-500/10 items-center justify-center">
                        <Ionicons
                          name="cloud-upload-outline"
                          size={20}
                          color="#3b82f6"
                        />
                      </View>
                      <Text className="text-base font-medium text-white">
                        {t("profile.importData")}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color="rgba(255,255,255,0.3)"
                    />
                  </Pressable>
                </Animated.View>

                <Animated.View
                  style={{ transform: [{ scale: privacyScale.scale }] }}
                >
                  <Pressable
                    className="flex-row items-center justify-between p-4"
                    onPressIn={privacyScale.pressIn}
                    onPressOut={privacyScale.pressOut}
                  >
                    <View className="flex-row items-center gap-4">
                      <View className="w-10 h-10 rounded-lg bg-green-500/10 items-center justify-center">
                        <Ionicons
                          name="lock-closed-outline"
                          size={20}
                          color="#22c55e"
                        />
                      </View>
                      <Text className="text-base font-medium text-white">
                        {t("profile.privacy")}
                      </Text>
                    </View>
                    <Ionicons
                      name="open-outline"
                      size={18}
                      color="rgba(255,255,255,0.3)"
                    />
                  </Pressable>
                </Animated.View>
              </View>
            </View>

            {/* Logout */}
            <View className="gap-2 mb-8">
              <View
                className="bg-[#2B1834] rounded-xl overflow-hidden"
                style={CARD_BORDER}
              >
                <Animated.View
                  style={{ transform: [{ scale: logoutScale.scale }] }}
                >
                  <Pressable
                    className="p-4 items-center"
                    onPressIn={logoutScale.pressIn}
                    onPressOut={logoutScale.pressOut}
                    onPress={handleLogout}
                  >
                    <Text className="text-base font-medium text-red-500">
                      {t("profile.logoutAccount")}
                    </Text>
                  </Pressable>
                </Animated.View>
              </View>
              <Text className="text-center text-xs text-white/20 mt-2">
                {t("profile.version", { ver: "1.0.0" })}
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Logout fade overlay */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "#1C1022",
          opacity: fadeOut,
        }}
      />
    </View>
  );
}
