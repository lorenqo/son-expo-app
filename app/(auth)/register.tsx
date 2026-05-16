import { useButtonAnimation } from "@/hooks/useButtonAnimation";
import { useScreenAnimation } from "@/hooks/useScreenAnimation";
import { createUser } from "@/models/user";
import { checkEmail, loginRequest, registerRequest } from "@/services/requests";
import { login } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const NEON_SHADOW = {
  shadowColor: "#A60DF2",
  shadowOpacity: 0.6,
  shadowRadius: 20,
  shadowOffset: { width: 0, height: 0 },
  elevation: 10,
} as const;

export default function RegisterScreen() {
  const { t } = useTranslation();

  const closeModal = () => {
    if (!router.canGoBack()) {
      router.replace("/");
      return;
    }
    router.back();
  };

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  const screen = useScreenAnimation();
  const primaryAnim = useButtonAnimation(1.03);
  const googleAnim = useButtonAnimation(1.06);
  const appleAnim = useButtonAnimation(1.06);

  const isSubmitDisabled = loading;

  const handleEmailBlur = async () => {
    if (!email || !email.includes("@")) return;
    try {
      setCheckingEmail(true);
      setEmailError("");
      const permission = await checkEmail(email);
      if (!permission) {
        setEmailError(t("authRegister.emailExists"));
      }
    } catch {
    } finally {
      setCheckingEmail(false);
    }
  };

  function validatePassword(password: string): string | null {
    if (!password) return t("authRegister.errorEmptyFields");
    if (
      password.length < 6 ||
      !/[A-Za-z]/.test(password) ||
      !/\d/.test(password)
    ) {
      return t("authRegister.passwordHint");
    }
    return null;
  }

  const registerUser = async () => {
    if (!name || !email || !password) {
      setError(t("authRegister.errorEmptyFields"));
      return;
    }
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    try {
      setLoading(true);
      setError("");
      await registerRequest(name, email, password);
      loginUser();
    } catch {
      setError(t("authRegister.errorServer"));
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async () => {
    if (!email || !password) {
      setError(t("authRegister.errorEmptyFields"));
      return;
    }
    try {
      setLoading(true);
      setError("");
      const response = await loginRequest(email, password);
      const user = response?.user;
      if (!user) {
        setError(t("authRegister.errorWrongLoginData"));
        return;
      }
      await login(createUser(user));
      closeModal();
    } catch {
      setError(t("authRegister.errorServer"));
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
              onPress={() => router.replace("../login")}
            >
              <Text className="text-sm font-medium leading-[18px] text-[#B790CB]">
                {t("authLogin.login")}
              </Text>
            </Pressable>
          </View>

          {/* header */}
          <View className="items-center mt-6">
            <View
              className="w-24 h-24 rounded-full items-center justify-center border-2 border-[#A60DF2]"
              style={NEON_SHADOW}
            >
              <Image
                source={require("../../assets/images/login_avatar.png")}
                style={{ width: 84, height: 84, borderRadius: 42 }}
                contentFit="cover"
              />
            </View>
            <Text className="mt-4 text-[28px] font-bold text-white">
              {t("authRegister.title")}
            </Text>
            <Text className="mt-2 text-center text-[#B790CB] leading-[22px] max-w-[340px]">
              {t("authRegister.subtitle")}
            </Text>
          </View>

          {/* form */}
          <View className="mt-8 gap-4">
            <View className="flex-row items-center rounded-full bg-[#2A1B32] border border-[rgba(255,255,255,0.08)]">
              <View className="ml-4">
                <Ionicons name="person-outline" size={20} color="#B790CB" />
              </View>
              <TextInput
                className="flex-1 py-4 px-2 text-white"
                placeholderTextColor="#9ca3af"
                placeholder={t("authRegister.namePlaceholder")}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setError("");
                }}
              />
            </View>

            <View className="flex-row items-center rounded-full bg-[#2A1B32] border border-[rgba(255,255,255,0.08)]">
              <View className="ml-4">
                <Ionicons name="mail-outline" size={20} color="#B790CB" />
              </View>
              <TextInput
                className="flex-1 py-4 px-2 text-white"
                placeholderTextColor="#9ca3af"
                placeholder={t("authRegister.emailPlaceholder")}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError("");
                }}
                onBlur={handleEmailBlur}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {emailError ? (
              <Text className="text-[#F87171] mt-2 text-center">{emailError}</Text>
            ) : null}

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
                placeholder={t("authRegister.passwordPlaceholder")}
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

            {password ? (
              <Text className="mt-[6px] text-[12px] text-center text-[#777]">
                {t("authRegister.passwordHint")}
              </Text>
            ) : null}

            {error ? (
              <Text className="text-[#F87171] mt-2 text-center">{error}</Text>
            ) : null}

            {/* primary button */}
            <Animated.View
              style={{ transform: [{ scale: primaryAnim.scale }] }}
            >
              <Pressable
                className={`mt-2 rounded-full py-4 items-center bg-[#A60DF2]${isSubmitDisabled ? " opacity-70" : ""}`}
                style={NEON_SHADOW}
                disabled={isSubmitDisabled}
                onPressIn={primaryAnim.pressIn}
                onPressOut={primaryAnim.pressOut}
                onHoverIn={primaryAnim.hoverIn}
                onHoverOut={primaryAnim.hoverOut}
                onPress={registerUser}
              >
                <Text className="text-white text-base font-bold">
                  {t("authRegister.createAccount")}
                </Text>
              </Pressable>
            </Animated.View>
          </View>

          {/* divider */}
          <View className="mt-8 flex-row items-center gap-4">
            <View className="flex-1 h-px bg-white/8" />
            <Text className="text-[#B790CB] text-[13px]">
              {t("authRegister.divider")}
            </Text>
            <View className="flex-1 h-px bg-white/8" />
          </View>

          {/* socials */}
          <View className="mt-6 flex-row justify-center gap-6">
            <Animated.View style={{ transform: [{ scale: googleAnim.scale }] }}>
              <Pressable
                className="w-14 h-14 rounded-full items-center justify-center bg-[#2A1B32] border border-[rgba(255,255,255,0.08)]"
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
          <View className="mt-8 items-center">
            <Text className="text-[12px] text-[#B790CB] text-center">
              {t("authRegister.termsText")}
            </Text>
            <View className="flex-row flex-wrap justify-center">
              <Text className="underline text-[#A60DF2]">
                {t("authRegister.terms")}
              </Text>
              <Text className="text-[12px] text-[#B790CB] text-center">
                {" "}
                {t("authRegister.and")}{" "}
              </Text>
              <Text className="underline text-[#A60DF2]">
                {t("authRegister.privacy")}
              </Text>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}
