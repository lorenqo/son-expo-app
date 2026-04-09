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
import { StyleSheet } from "react-native-unistyles";

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

  /* ================= animations ================= */

  const screen = useScreenAnimation();
  const primaryAnim = useButtonAnimation(1.03);
  const googleAnim = useButtonAnimation(1.06);
  const appleAnim = useButtonAnimation(1.06);

  /* ================= logic ================= */

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
    <View style={styles.root}>
      <Animated.View
        style={{
          flex: 1,
          opacity: screen.opacity,
          transform: [{ translateY: screen.translateY }],
        }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* top action */}
          <View style={styles.topBar}>
            <Pressable style={styles.topButton} onPress={closeModal}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
            <Pressable
              style={styles.topButton}
              onPress={() => router.replace("../login")}
            >
              <Text style={styles.secondaryButtonText}>
                {t("authLogin.login")}
              </Text>
            </Pressable>
          </View>

          {/* header */}
          <View style={styles.header}>
            <View style={styles.avatarWrapper}>
              <Image
                source={require("../../assets/images/login_avatar.png")}
                style={{ width: 84, height: 84, borderRadius: 42 }}
                contentFit="cover"
              />
            </View>
            <Text style={styles.title}>{t("authRegister.title")}</Text>
            <Text style={styles.subtitle}>{t("authRegister.subtitle")}</Text>
          </View>

          {/* form */}
          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIcon}>
                <Ionicons name="person-outline" size={20} color="#B790CB" />
              </View>
              <TextInput
                placeholderTextColor="#9ca3af"
                placeholder={t("authRegister.namePlaceholder")}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setError("");
                }}
                style={styles.input}
              />
            </View>

            <View style={styles.inputWrapper}>
              <View style={styles.inputIcon}>
                <Ionicons name="mail-outline" size={20} color="#B790CB" />
              </View>
              <TextInput
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
                style={styles.input}
              />
            </View>

            {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

            <View style={styles.inputWrapper}>
              <View style={styles.inputIcon}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#B790CB"
                />
              </View>
              <TextInput
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                style={styles.input}
                placeholder={t("authRegister.passwordPlaceholder")}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError("");
                }}
              />
              <Pressable
                style={styles.eyeButton}
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
              <Text style={styles.hint}>{t("authRegister.passwordHint")}</Text>
            ) : null}

            {error ? <Text style={styles.error}>{error}</Text> : null}

            {/* primary button */}
            <Animated.View
              style={{ transform: [{ scale: primaryAnim.scale }] }}
            >
              <Pressable
                style={[
                  styles.primaryButton,
                  isSubmitDisabled && styles.primaryButtonDisabled,
                ]}
                disabled={isSubmitDisabled}
                onPressIn={primaryAnim.pressIn}
                onPressOut={primaryAnim.pressOut}
                onHoverIn={primaryAnim.hoverIn}
                onHoverOut={primaryAnim.hoverOut}
                onPress={registerUser}
              >
                <Text style={styles.primaryButtonText}>
                  {t("authRegister.createAccount")}
                </Text>
              </Pressable>
            </Animated.View>
          </View>

          {/* divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t("authRegister.divider")}</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* socials */}
          <View style={styles.socials}>
            <Animated.View style={{ transform: [{ scale: googleAnim.scale }] }}>
              <Pressable
                style={styles.socialButton}
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
                style={styles.socialButton}
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
          <View style={styles.footer}>
            <Text style={styles.footerText}>{t("authRegister.termsText")}</Text>
            <View style={styles.footerRow}>
              <Text style={styles.link}>{t("authRegister.terms")}</Text>
              <Text style={styles.footerText}> {t("authRegister.and")} </Text>
              <Text style={styles.link}>{t("authRegister.privacy")}</Text>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    </View>
  );
}

/* ================= styles ================= */

const styles = StyleSheet.create((theme) => ({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: theme.gap(3),
    paddingBottom: theme.gap(4),
    ...(Platform.OS === "web" && {
      maxWidth: 620,
      width: "100%",
      alignSelf: "center",
    }),
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: theme.gap(6),
  },
  topButton: {
    height: 36,
    paddingHorizontal: theme.gap(2),
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.overlay,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 18,
    color: theme.colors.dimmed,
  },
  closeText: {
    fontSize: 16,
    lineHeight: 18,
    color: theme.colors.dimmed,
  },
  header: {
    alignItems: "center",
    marginTop: theme.gap(3),
  },
  avatarWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.tint,
    ...theme.shadows.neon,
  },
  title: {
    marginTop: theme.gap(2),
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.typography,
  },
  subtitle: {
    marginTop: theme.gap(1),
    textAlign: "center",
    color: theme.colors.dimmed,
    lineHeight: 22,
    maxWidth: 340,
  },
  form: {
    marginTop: theme.gap(4),
    gap: theme.gap(2),
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inputIcon: {
    marginLeft: theme.gap(2),
  },
  input: {
    flex: 1,
    paddingVertical: theme.gap(2),
    paddingHorizontal: theme.gap(1),
    color: theme.colors.typography,
    outlineWidth: 0,
  },
  eyeButton: {
    paddingHorizontal: theme.gap(2),
  },
  hint: {
    marginTop: 6,
    fontSize: 12,
    textAlign: "center",
    color: "#777",
  },
  error: {
    color: theme.colors.danger ?? "red",
    marginTop: theme.gap(1),
    textAlign: "center",
  },
  primaryButton: {
    marginTop: theme.gap(1),
    borderRadius: theme.radius.full,
    paddingVertical: theme.gap(2),
    alignItems: "center",
    backgroundColor: theme.colors.tint,
    ...theme.shadows.neon,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  divider: {
    marginTop: theme.gap(4),
    flexDirection: "row",
    alignItems: "center",
    gap: theme.gap(2),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    color: theme.colors.dimmed,
    fontSize: 13,
  },
  socials: {
    marginTop: theme.gap(3),
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.gap(3),
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  footer: {
    marginTop: theme.gap(4),
    alignItems: "center",
  },
  footerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  footerText: {
    fontSize: 12,
    color: theme.colors.dimmed,
    textAlign: "center",
  },
  link: {
    textDecorationLine: "underline",
    color: theme.colors.link,
  },
}));
