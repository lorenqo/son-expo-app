import { useButtonAnimation } from "@/hooks/useButtonAnimation";
import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Animated, Pressable, Text, View } from "react-native";

const NEON_SHADOW = {
  shadowColor: "#A60DF2",
  shadowOpacity: 0.6,
  shadowRadius: 20,
  shadowOffset: { width: 0, height: 0 },
  elevation: 10,
} as const;

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
    <View className="flex-1 bg-[#1C1022] items-center justify-center px-6 pb-8">
      {/* Icon */}
      <View className="items-center justify-center mb-8">
        <Ionicons name="wifi" size={100} color="#A60DF2" />
      </View>

      {/* Text */}
      <View className="items-center gap-3 max-w-[300px] mb-8">
        <Text className="text-2xl font-bold text-white tracking-[-0.5px] text-center">
          {t("offline.title")}
        </Text>
        <Text className="text-[15px] text-[#B790CB] text-center leading-[22px]">
          {t("offline.subtitle")}
        </Text>
      </View>

      {/* Buttons */}
      <View className="w-full max-w-[360px] gap-3">
        <Animated.View style={{ transform: [{ scale: retryAnim.scale }] }}>
          <Pressable
            className="flex-row items-center justify-center gap-2 bg-[#A60DF2] py-4 rounded-full"
            style={NEON_SHADOW}
            onPress={handleRetry}
            onPressIn={retryAnim.pressIn}
            onPressOut={retryAnim.pressOut}
            onHoverIn={retryAnim.hoverIn}
            onHoverOut={retryAnim.hoverOut}
          >
            <Ionicons name="refresh-outline" size={20} color="#fff" />
            <Text className="text-white text-base font-bold">
              {t("offline.retry")}
            </Text>
          </Pressable>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: savedAnim.scale }] }}>
          <Pressable
            className="flex-row items-center justify-center gap-2 bg-white/5 py-4 rounded-full border border-white/8"
            onPressIn={savedAnim.pressIn}
            onPressOut={savedAnim.pressOut}
            onHoverIn={savedAnim.hoverIn}
            onHoverOut={savedAnim.hoverOut}
          >
            <Ionicons name="book-outline" size={20} color="#B790CB" />
            <Text className="text-[#B790CB] text-[15px] font-medium">
              {t("offline.savedDreams")}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}
