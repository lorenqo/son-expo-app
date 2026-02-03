import { createUser } from "@/models/user";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
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
import { StyleSheet } from "react-native-unistyles";
import { checkEmail, loginRequest } from "../../services/requests";
import { login } from "../../store/authStore";

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

  /* ================= animations ================= */

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const screenTranslate = useRef(new Animated.Value(8)).current;

  const loginScale = useRef(new Animated.Value(1)).current;
  const guestScale = useRef(new Animated.Value(1)).current;
  const googleScale = useRef(new Animated.Value(1)).current;
  const appleScale = useRef(new Animated.Value(1)).current;

  const [emailError, setEmailError] = useState("");
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isSubmitDisabled = loading || checkingEmail || Boolean(emailError);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(screenOpacity, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(screenTranslate, {
        toValue: 0,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  /* ---------- press ---------- */

  const pressIn = (v: Animated.Value) => {
    Animated.spring(v, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  const pressOut = (v: Animated.Value) => {
    Animated.spring(v, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  /* ---------- hover (web) ---------- */

  const hoverIn = (v: Animated.Value, scale = 1.01) => {
    Animated.spring(v, {
      toValue: scale,
      useNativeDriver: true,
      speed: 18,
      bounciness: 4,
    }).start();
  };

  const hoverOut = (v: Animated.Value) => {
    Animated.spring(v, {
      toValue: 1,
      useNativeDriver: true,
      speed: 18,
      bounciness: 4,
    }).start();
  };

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

      await login(createUser(user));
      closeModal();
    } catch {
      setError(t("authLogin.errorServer"));
    } finally {
      setLoading(false);
    }
  };

  /* ================= render ================= */

  return (
    <View style={styles.root}>
      <Animated.View
        style={{
          flex: 1,
          opacity: screenOpacity,
          transform: [{ translateY: screenTranslate }],
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
              onPress={() => router.replace("../register")}
            >
              <Text style={styles.secondaryButtonText}>
                {t("authLogin.register")}
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

            <Text style={styles.title}>{t("authLogin.title")}</Text>
            <Text style={styles.subtitle}>{t("authLogin.subtitle")}</Text>
          </View>

          {/* form */}
          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIcon}>
                <Ionicons name="mail-outline" size={20} color="#B790CB" />
              </View>

              <TextInput
                placeholderTextColor="#9ca3af"
                placeholder={t("authLogin.emailPlaceholder")}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError("");
                }}
                onBlur={handleEmailBlur}
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

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
                placeholder={t("authLogin.passwordPlaceholder")}
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

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable style={styles.forgot}>
              <Text style={styles.forgotText}>
                {t("authLogin.forgotPassword")}
              </Text>
            </Pressable>

            {/* primary */}
            <Animated.View style={{ transform: [{ scale: loginScale }] }}>
              <Pressable
                style={styles.primaryButton}
                onPressIn={() => pressIn(loginScale)}
                onPressOut={() => pressOut(loginScale)}
                onHoverIn={() => hoverIn(loginScale, 1.03)}
                onHoverOut={() => hoverOut(loginScale)}
                onPress={loginUser}
              >
                <Text style={styles.primaryButtonText}>
                  {t("authLogin.login")}
                </Text>
              </Pressable>
            </Animated.View>

            {/* guest */}
            <Animated.View style={{ transform: [{ scale: guestScale }] }}>
              <Pressable
                style={styles.outlineButton}
                onPress={closeModal}
                onPressIn={() => pressIn(guestScale)}
                onPressOut={() => pressOut(guestScale)}
                onHoverIn={() => hoverIn(guestScale, 1.025)}
                onHoverOut={() => hoverOut(guestScale)}
              >
                <Text style={styles.outlineButtonText}>
                  {t("authLogin.continueAsGuest")}
                </Text>
              </Pressable>
            </Animated.View>
          </View>

          {/* divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t("authLogin.divider")}</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* socials */}
          <View style={styles.socials}>
            <Animated.View style={{ transform: [{ scale: googleScale }] }}>
              <Pressable
                style={styles.socialButton}
                onPressIn={() => pressIn(googleScale)}
                onPressOut={() => pressOut(googleScale)}
                onHoverIn={() => hoverIn(googleScale, 1.06)}
                onHoverOut={() => hoverOut(googleScale)}
              >
                <Ionicons name="logo-google" size={22} />
              </Pressable>
            </Animated.View>

            <Animated.View style={{ transform: [{ scale: appleScale }] }}>
              <Pressable
                style={styles.socialButton}
                onPressIn={() => pressIn(appleScale)}
                onPressOut={() => pressOut(appleScale)}
                onHoverIn={() => hoverIn(appleScale, 1.06)}
                onHoverOut={() => hoverOut(appleScale)}
              >
                <Ionicons name="logo-apple" size={22} />
              </Pressable>
            </Animated.View>
          </View>

          {/* footer */}
          <Text style={styles.footer}>
            {t("authLogin.termsText")}
            {"\n"}
            <Text style={styles.link}>{t("authLogin.terms")}</Text>{" "}
            {t("authLogin.and")}{" "}
            <Text style={styles.link}>{t("authLogin.privacy")}</Text>
          </Text>
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
    backgroundColor: theme.colors.surfaceTranslucent,
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

  forgot: {
    alignSelf: "flex-end",
  },

  forgotText: {
    color: theme.colors.link,
    fontWeight: "500",
  },

  primaryButton: {
    marginTop: theme.gap(1),
    borderRadius: theme.radius.full,
    paddingVertical: theme.gap(2),
    alignItems: "center",
    backgroundColor: theme.colors.tint,
    ...theme.shadows.neon,
  },

  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  outlineButton: {
    borderRadius: theme.radius.full,
    paddingVertical: theme.gap(2),
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  outlineButtonText: {
    color: theme.colors.typography,
    fontWeight: "500",
  },

  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
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
    ...theme.shadows.soft,
  },

  footer: {
    marginTop: theme.gap(4),
    textAlign: "center",
    fontSize: 12,
    color: theme.colors.dimmed,
  },

  link: {
    textDecorationLine: "underline",
    color: theme.colors.link,
  },
}));
