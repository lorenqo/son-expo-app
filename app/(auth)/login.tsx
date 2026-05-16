import { useButtonAnimation } from "@/hooks/useButtonAnimation";
import { useScreenAnimation } from "@/hooks/useScreenAnimation";
import { createUser } from "@/models/user";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { checkEmail, loginRequest } from "../../services/requests";
import { login } from "../../store/authStore";

const NEON_SHADOW = {
  shadowColor: "#A60DF2",
  shadowOpacity: 0.6,
  shadowRadius: 20,
  shadowOffset: { width: 0, height: 0 },
  elevation: 10,
} as const;

const SOFT_SHADOW = {
  shadowColor: "#000",
  shadowOpacity: 0.25,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 6 },
  elevation: 6,
} as const;

export default function Login() {
  const { t } = useTranslation();

  const closeModal = () => {
    if (!router.canGoBack()) {
      router.replace("/");
      return;
    }
    router.back();
  };

  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isSubmitDisabled = loading || checkingEmail || Boolean(emailError);

  const fadeOut = useRef(new Animated.Value(0)).current;

  const screen = useScreenAnimation();
  const loginAnim = useButtonAnimation(1.03);
  const guestAnim = useButtonAnimation(1.025);
  const googleAnim = useButtonAnimation(1.06);
  const appleAnim = useButtonAnimation(1.06);

  const handleEmailBlur = async () => {
    if (!email || !email.includes("@")) return;
    try {
      setCheckingEmail(true);
      setEmailError("");
      const permission = await checkEmail(email);
      if (permission) {
        setEmailError(t("authLogin.emailNotFound"));
      }
    } catch {
    } finally {
      setCheckingEmail(false);
    }
  };

  const loginUser = async () => {
    if (!email || !password) {
      setError(t("authLogin.errorEmptyFields"));
      return;
    }
    try {
      setLoading(true);
      setError("");
      const response = await loginRequest(email, password);
      const user = response?.user;
      if (!user) {
        setError(t("authLogin.errorWrongLoginData"));
        return;
      }
      Animated.timing(fadeOut, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start(async () => {
        await login(createUser(user));
      });
    } catch {
      setError(t("authLogin.errorServer"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#1C1022]">
      <Animated.View
        style={{
          flex: 1,
          opacity: screen.opacity,
          transform: [{ translateY: screen.translateY }],
        }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 24,
            paddingBottom: 32,
            ...(Platform.OS === "web" && {
              maxWidth: 620,
              width: "100%",
              alignSelf: "center",
            }),
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* top action */}
          <View className="flex-row items-center justify-between mt-16">
            <Pressable
              className="h-9 px-4 rounded-full border border-[rgba(255,255,255,0.08)] bg-white/5 items-center justify-center"
              onPress={closeModal}
            >
              <Text className="text-base leading-[18px] text-[#B790CB]">✕</Text>
            </Pressable>
            <Pressable
              className="h-9 px-4 rounded-full border border-[rgba(255,255,255,0.08)] bg-white/5 items-center justify-center"
              onPress={() => router.replace("../register")}
            >
              <Text className="text-sm font-medium leading-[18px] text-[#B790CB]">
                {t("authLogin.register")}
              </Text>
            </Pressable>
          </View>

          {/* header */}
          <View className="items-center mt-6">
            <View
              className="w-24 h-24 rounded-full items-center justify-center"
              style={{ ...NEON_SHADOW, borderWidth: 2, borderColor: "#A60DF2" }}
            >
              <Image
                source={require("../../assets/images/login_avatar.png")}
                style={{ width: 84, height: 84, borderRadius: 42 }}
                contentFit="cover"
              />
            </View>
            <Text className="mt-4 text-[28px] font-bold text-white">
              {t("authLogin.title")}
            </Text>
            <Text className="mt-2 text-center text-[#B790CB] leading-[22px]">
              {t("authLogin.subtitle")}
            </Text>
          </View>

          {/* form */}
          <View className="mt-8 gap-4">
            <View className="flex-row items-center rounded-full bg-[#2A1B32] border border-[rgba(255,255,255,0.08)]">
              <View className="ml-4">
                <Ionicons name="mail-outline" size={20} color="#B790CB" />
              </View>
              <TextInput
                className="flex-1 py-4 px-2 text-white"
                placeholderTextColor="#9ca3af"
                placeholder={t("authLogin.emailPlaceholder")}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError("");
                }}
                onBlur={handleEmailBlur}
                autoCapitalize="none"
              />
            </View>

            <View className="flex-row items-center rounded-full bg-[#2A1B32] border border-[rgba(255,255,255,0.08)]">
              <View className="ml-4">
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#B790CB"
                />
              </View>
              <TextInput
                className="flex-1 py-4 px-2 text-white"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                placeholder={t("authLogin.passwordPlaceholder")}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError("");
                }}
              />
              <Pressable
                className="px-4"
                onPress={() => setShowPassword((v) => !v)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#9ca3af"
                />
              </Pressable>
            </View>

            {error ? (
              <Text className="text-[#F87171] mb-[10px] text-center">
                {error}
              </Text>
            ) : null}

            <Pressable className="self-end">
              <Text className="text-[#A60DF2] font-medium">
                {t("authLogin.forgotPassword")}
              </Text>
            </Pressable>

            {/* primary */}
            <Animated.View style={{ transform: [{ scale: loginAnim.scale }] }}>
              <Pressable
                className="mt-2 rounded-full py-4 items-center bg-[#A60DF2]"
                style={NEON_SHADOW}
                disabled={isSubmitDisabled}
                onPressIn={loginAnim.pressIn}
                onPressOut={loginAnim.pressOut}
                onHoverIn={loginAnim.hoverIn}
                onHoverOut={loginAnim.hoverOut}
                onPress={loginUser}
              >
                <Text className="text-white text-base font-bold">
                  {t("authLogin.login")}
                </Text>
              </Pressable>
            </Animated.View>

            {/* guest */}
            <Animated.View style={{ transform: [{ scale: guestAnim.scale }] }}>
              <Pressable
                className="rounded-full py-4 items-center border border-[rgba(255,255,255,0.08)]"
                onPress={closeModal}
                onPressIn={guestAnim.pressIn}
                onPressOut={guestAnim.pressOut}
                onHoverIn={guestAnim.hoverIn}
                onHoverOut={guestAnim.hoverOut}
              >
                <Text className="text-white font-medium">
                  {t("authLogin.continueAsGuest")}
                </Text>
              </Pressable>
            </Animated.View>
          </View>

          {/* divider */}
          <View className="mt-8 flex-row items-center gap-4">
            <View className="flex-1 h-px bg-white/8" />
            <Text className="text-[#B790CB] text-[13px]">
              {t("authLogin.divider")}
            </Text>
            <View className="flex-1 h-px bg-white/8" />
          </View>

          {/* socials */}
          <View className="mt-6 flex-row justify-center gap-6">
            <Animated.View style={{ transform: [{ scale: googleAnim.scale }] }}>
              <Pressable
                className="w-14 h-14 rounded-full items-center justify-center bg-[#2A1B32] border border-[rgba(255,255,255,0.08)]"
                style={SOFT_SHADOW}
                onPressIn={googleAnim.pressIn}
                onPressOut={googleAnim.pressOut}
                onHoverIn={googleAnim.hoverIn}
                onHoverOut={googleAnim.hoverOut}
              >
                <Ionicons name="logo-google" size={22} />
              </Pressable>
            </Animated.View>

            <Animated.View style={{ transform: [{ scale: appleAnim.scale }] }}>
              <Pressable
                className="w-14 h-14 rounded-full items-center justify-center bg-[#2A1B32] border border-[rgba(255,255,255,0.08)]"
                style={SOFT_SHADOW}
                onPressIn={appleAnim.pressIn}
                onPressOut={appleAnim.pressOut}
                onHoverIn={appleAnim.hoverIn}
                onHoverOut={appleAnim.hoverOut}
              >
                <Ionicons name="logo-apple" size={22} />
              </Pressable>
            </Animated.View>
          </View>

          {/* footer */}
          <Text className="mt-8 text-center text-[12px] text-[#B790CB]">
            {t("authLogin.termsText")}
            {"\n"}
            <Text className="underline text-[#A60DF2]">
              {t("authLogin.terms")}
            </Text>{" "}
            {t("authLogin.and")}{" "}
            <Text className="underline text-[#A60DF2]">
              {t("authLogin.privacy")}
            </Text>
          </Text>
        </ScrollView>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "#1C1022",
          opacity: fadeOut,
        }}
      />
    </View>
  );
}
