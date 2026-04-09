import { useButtonAnimation } from "@/hooks/useButtonAnimation";
import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Animated, Pressable, Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function OfflineScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const retryAnim = useButtonAnimation(1.03);
  const savedAnim = useButtonAnimation(1.03);

  const handleRetry = async () => {
    const state = await NetInfo.fetch();
    if (state.isConnected) {
      router.replace("/");
    }
  };

  return (
    <View style={styles.container}>
      {/* Icon */}
      <View style={styles.iconWrapper}>
        <Ionicons name="wifi" size={100} color="#A60DF2" />
      </View>

      {/* Text */}
      <View style={styles.textBlock}>
        <Text style={styles.title}>{t("offline.title")}</Text>
        <Text style={styles.subtitle}>{t("offline.subtitle")}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        <Animated.View style={{ transform: [{ scale: retryAnim.scale }] }}>
          <Pressable
            style={styles.primaryButton}
            onPress={handleRetry}
            onPressIn={retryAnim.pressIn}
            onPressOut={retryAnim.pressOut}
            onHoverIn={retryAnim.hoverIn}
            onHoverOut={retryAnim.hoverOut}
          >
            <Ionicons name="refresh-outline" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>{t("offline.retry")}</Text>
          </Pressable>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: savedAnim.scale }] }}>
          <Pressable
            style={styles.secondaryButton}
            onPressIn={savedAnim.pressIn}
            onPressOut={savedAnim.pressOut}
            onHoverIn={savedAnim.hoverIn}
            onHoverOut={savedAnim.hoverOut}
          >
            <Ionicons name="book-outline" size={20} color="#B790CB" />
            <Text style={styles.secondaryButtonText}>
              {t("offline.savedDreams")}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.gap(3),
    paddingBottom: theme.gap(4),
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.gap(4),
  },
  textBlock: {
    alignItems: "center",
    gap: theme.gap(1.5),
    maxWidth: 300,
    marginBottom: theme.gap(4),
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.typography,
    letterSpacing: -0.5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: theme.colors.dimmed,
    textAlign: "center",
    lineHeight: 22,
  },
  buttons: {
    width: "100%",
    maxWidth: 360,
    gap: theme.gap(1.5),
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.gap(1),
    backgroundColor: theme.colors.tint,
    paddingVertical: theme.gap(2),
    borderRadius: theme.radius.full,
    ...theme.shadows.neon,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.gap(1),
    backgroundColor: theme.colors.surfaceTranslucent,
    paddingVertical: theme.gap(2),
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  secondaryButtonText: {
    color: theme.colors.dimmed,
    fontSize: 15,
    fontWeight: "500",
  },
}));
