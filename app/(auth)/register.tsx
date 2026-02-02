import { createUser } from "@/models/user";
import { checkEmail, loginRequest, registerRequest } from "@/services/requests";
import { login } from "@/store/authStore";
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

export default function RegisterScreen() {
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [emailError, setEmailError] = useState("");
  const [checkingEmail, setCheckingEmail] = useState(false);

  const [loading, setLoading] = useState(false);

  /* ================= animations ================= */

  const screenOpacity = useRef(new Animated.Value(0)).current;
  const screenTranslate = useRef(new Animated.Value(8)).current;

  const primaryScale = useRef(new Animated.Value(1)).current;
  const googleScale = useRef(new Animated.Value(1)).current;
  const appleScale = useRef(new Animated.Value(1)).current;

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
  }, [screenOpacity, screenTranslate]);

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
    if (!password) {
      return t("authRegister.errorEmptyFields");
    }

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
      router.back();
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
      router.back();
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
            <Pressable style={styles.topButton} onPress={() => router.back()}>
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

            {/* primary */}
            <Animated.View style={{ transform: [{ scale: primaryScale }] }}>
              <Pressable
                style={[
                  styles.primaryButton,
                  isSubmitDisabled && styles.primaryButtonDisabled,
                ]}
                disabled={isSubmitDisabled}
                onPressIn={() => pressIn(primaryScale)}
                onPressOut={() => pressOut(primaryScale)}
                onHoverIn={() => hoverIn(primaryScale, 1.03)}
                onHoverOut={() => hoverOut(primaryScale)}
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

  /* ---------- top ---------- */

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

  /* ---------- header ---------- */

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

  /* ---------- form ---------- */

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

  /* ---------- divider ---------- */

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

  /* ---------- socials ---------- */

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

  /* ---------- footer ---------- */

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
