import { useScreenAnimation } from "@/hooks/useScreenAnimation";
import { refreshPremium } from "@/store/purchasesStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "@/src/i18n";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Purchases from "react-native-purchases";

const BENEFIT_ICONS: (keyof typeof Ionicons.glyphMap)[] = [
  "sparkles",
  "moon",
  "eye-off",
  "cloud-done",
];

function usePressScale(to = 0.97) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () =>
    Animated.spring(scale, { toValue: to, useNativeDriver: true, bounciness: 0, speed: 30 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 0, speed: 30 }).start();
  return { scale, pressIn, pressOut };
}

export default function Paywall() {
  const { t } = useTranslation();
  const anim = useScreenAnimation();
  const ctaScale = usePressScale(0.96);
  const [selected, setSelected] = useState<"yearly" | "monthly">("yearly");
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const handleSubscribe = async () => {
    if (Platform.OS === "web") {
      Alert.alert(t("paywall.webOnly"));
      return;
    }
    setLoading(true);
    try {
      const offerings = await Purchases.getOfferings();
      const packages = offerings.current?.availablePackages ?? [];
      const pkg = packages.find((p) => p.product.identifier === selected) ?? packages[0];

      if (!pkg) {
        Alert.alert(t("paywall.noPackages"));
        return;
      }

      await Purchases.purchasePackage(pkg);
      await refreshPremium();
      router.back();
    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert(t("paywall.purchaseFailed"), e.message ?? t("paywall.tryAgain"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    if (Platform.OS === "web") return;
    setLoading(true);
    try {
      await Purchases.restorePurchases();
      await refreshPremium();
      router.back();
    } catch (e: any) {
      Alert.alert(t("paywall.restoreFailed"), e.message ?? t("paywall.tryAgain"));
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = (plan: "yearly" | "monthly") => ({
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#2B1834",
    borderWidth: 2,
    borderColor: selected === plan ? "#A60DF2" : "rgba(255,255,255,0.06)",
    shadowColor: "#A60DF2",
    shadowOpacity: selected === plan ? 0.4 : 0,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
    elevation: selected === plan ? 8 : 0,
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#1C1022" }}>
      {/* Close button — floats over scroll, properly below status bar */}
      <View style={{ position: "absolute", top: insets.top + 10, right: 16, zIndex: 10 }}>
        <Pressable
          onPress={() => router.back()}
          style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.08)", alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name="close" size={20} color="#f1e9f4" />
        </Pressable>
      </View>

      <SafeAreaView style={{ flex: 1 }}>
        <Animated.ScrollView
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 56,
            paddingBottom: 48,
            alignItems: "center",
          }}
          style={{ opacity: anim.opacity, transform: [{ translateY: anim.translateY }] }}
          showsVerticalScrollIndicator={false}
        >
          {/* Headline */}
          <Text
            style={{
              fontSize: 28,
              fontWeight: "700",
              color: "#f1e9f4",
              textAlign: "center",
              marginBottom: 12,
              letterSpacing: -0.3,
            }}
          >
            {t("paywall.title")}
          </Text>
          <Text
            style={{
              color: "rgba(210,193,215,0.85)",
              textAlign: "center",
              marginBottom: 40,
              lineHeight: 22,
              maxWidth: 300,
              fontSize: 15,
            }}
          >
            {t("paywall.subtitle")}
          </Text>

          {/* Plans */}
          <View style={{ width: "100%", gap: 12, marginBottom: 32 }}>
            {/* Yearly */}
            <Pressable onPress={() => setSelected("yearly")} style={cardStyle("yearly")}>
              <View
                style={{
                  position: "absolute",
                  top: -11,
                  right: 16,
                  backgroundColor: "#A60DF2",
                  paddingHorizontal: 12,
                  paddingVertical: 3,
                  borderRadius: 999,
                }}
              >
                <Text style={{ color: "white", fontSize: 10, fontWeight: "700", letterSpacing: 1.2, textTransform: "uppercase" }}>
                  {t("paywall.saveBadge")}
                </Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View>
                  <Text style={{ fontSize: 17, fontWeight: "700", color: "#f1e9f4" }}>{t("paywall.yearlyTitle")}</Text>
                  <Text style={{ fontSize: 13, color: "rgba(210,193,215,0.7)", marginTop: 3 }}>{t("paywall.yearlyDesc")}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ fontSize: 17, fontWeight: "700", color: "#b025fc" }}>{t("paywall.yearlyPrice")}</Text>
                  <Text style={{ fontSize: 10, color: "rgba(210,193,215,0.7)", textTransform: "uppercase" }}>{t("paywall.yearlyPer")}</Text>
                </View>
              </View>
            </Pressable>

            {/* Monthly */}
            <Pressable onPress={() => setSelected("monthly")} style={cardStyle("monthly")}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View>
                  <Text style={{ fontSize: 17, fontWeight: "700", color: "#f1e9f4" }}>{t("paywall.monthlyTitle")}</Text>
                  <Text style={{ fontSize: 13, color: "rgba(210,193,215,0.7)", marginTop: 3 }}>{t("paywall.monthlyDesc")}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ fontSize: 17, fontWeight: "700", color: "#f1e9f4" }}>{t("paywall.monthlyPrice")}</Text>
                  <Text style={{ fontSize: 10, color: "rgba(210,193,215,0.7)", textTransform: "uppercase" }}>{t("paywall.monthlyPer")}</Text>
                </View>
              </View>
            </Pressable>
          </View>

          {/* Benefits */}
          <View
            style={{
              width: "100%",
              backgroundColor: "rgba(43,24,52,0.35)",
              padding: 24,
              borderRadius: 16,
              gap: 20,
              marginBottom: 32,
            }}
          >
            {BENEFIT_ICONS.map((icon, i) => (
              <View key={icon} style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
                <Ionicons name={icon} size={20} color="#A60DF2" />
                <Text style={{ fontSize: 14, color: "#f1e9f4" }}>{t(`paywall.benefit${i + 1}`)}</Text>
              </View>
            ))}
          </View>

          {/* CTA */}
          <Animated.View style={{ width: "100%", transform: [{ scale: ctaScale.scale }] }}>
            <Pressable
              onPress={handleSubscribe}
              onPressIn={ctaScale.pressIn}
              onPressOut={ctaScale.pressOut}
              disabled={loading}
              style={{
                paddingVertical: 18,
                backgroundColor: "#A60DF2",
                borderRadius: 999,
                alignItems: "center",
                shadowColor: "#A60DF2",
                shadowOpacity: 0.5,
                shadowRadius: 20,
                shadowOffset: { width: 0, height: 0 },
                elevation: 10,
              }}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={{ color: "white", fontWeight: "700", fontSize: 14, letterSpacing: 1.5, textTransform: "uppercase" }}>
                  {t("paywall.subscribe")}
                </Text>
              )}
            </Pressable>
          </Animated.View>

          {/* Footer */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 12, marginTop: 24 }}>
            <Pressable onPress={handleRestore}>
              <Text style={{ fontSize: 10, color: "rgba(210,193,215,0.5)", textTransform: "uppercase", letterSpacing: 0.5 }}>
                {t("paywall.restore")}
              </Text>
            </Pressable>
            <Text style={{ fontSize: 10, color: "rgba(210,193,215,0.5)", textTransform: "uppercase", letterSpacing: 0.5 }}>
              {t("paywall.terms")}
            </Text>
            <Text style={{ fontSize: 10, color: "rgba(210,193,215,0.5)", textTransform: "uppercase", letterSpacing: 0.5 }}>
              {t("paywall.privacy")}
            </Text>
          </View>
        </Animated.ScrollView>
      </SafeAreaView>
    </View>

  );
}
