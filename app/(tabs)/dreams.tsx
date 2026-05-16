import { useButtonAnimation } from "@/hooks/useButtonAnimation";
import { useScreenAnimation } from "@/hooks/useScreenAnimation";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Animated, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NEON_SHADOW = {
  shadowColor: "#A60DF2",
  shadowOpacity: 0.55,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 0 },
  elevation: 10,
} as const;

export default function Dreams() {
  const { t } = useTranslation();
  const screen = useScreenAnimation();
  const fab = useButtonAnimation(1.08);
  const cta = useButtonAnimation(1.03);

  const goToChat = () => router.push("/chat");

  return (
    <View className="flex-1 bg-[#1C1022]">
      <SafeAreaView className="flex-1">
        <Animated.View
          style={{
            flex: 1,
            opacity: screen.opacity,
            transform: [{ translateY: screen.translateY }],
          }}
        >
          <ScrollView
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View className="flex-row items-end justify-between px-6 pt-4 pb-8">
              <View>
                <Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">
                  {t("dreams.subheading")}
                </Text>
                <Text className="text-white text-[30px] font-bold tracking-tight leading-[34px]">
                  {t("dreams.title")}
                </Text>
              </View>

              <Animated.View style={{ transform: [{ scale: fab.scale }] }}>
                <Pressable
                  style={NEON_SHADOW}
                  className="w-14 h-14 rounded-full bg-[#A60DF2] items-center justify-center"
                  onPressIn={fab.pressIn}
                  onPressOut={fab.pressOut}
                  onHoverIn={fab.hoverIn}
                  onHoverOut={fab.hoverOut}
                  onPress={goToChat}
                >
                  <Ionicons name="add" size={30} color="white" />
                </Pressable>
              </Animated.View>
            </View>

            {/* Empty state */}
            <View className="items-center px-6 mt-10">
              <View
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: 55,
                  backgroundColor: "rgba(166,13,242,0.1)",
                  borderWidth: 1,
                  borderColor: "rgba(166,13,242,0.22)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 24,
                  ...NEON_SHADOW,
                  shadowOpacity: 0.18,
                }}
              >
                <Ionicons name="moon" size={48} color="#A60DF2" />
              </View>

              <Text className="text-white text-[22px] font-bold text-center mb-3">
                {t("dreams.emptyTitle")}
              </Text>
              <Text className="text-[#B790CB] text-[15px] text-center leading-[22px] max-w-[260px] mb-8">
                {t("dreams.emptySubtitle")}
              </Text>

              <Animated.View style={{ transform: [{ scale: cta.scale }] }}>
                <Pressable
                  style={NEON_SHADOW}
                  className="flex-row items-center gap-2 bg-[#A60DF2] py-3.5 px-7 rounded-full"
                  onPressIn={cta.pressIn}
                  onPressOut={cta.pressOut}
                  onHoverIn={cta.hoverIn}
                  onHoverOut={cta.hoverOut}
                  onPress={goToChat}
                >
                  <Ionicons name="add-circle-outline" size={20} color="white" />
                  <Text className="text-white font-semibold text-[15px]">
                    {t("dreams.addFirst")}
                  </Text>
                </Pressable>
              </Animated.View>
            </View>

            {/* Hint cards */}
            <View className="flex-row gap-3 px-6 mt-12">
              <View
                className="flex-1 rounded-xl p-4"
                style={{
                  backgroundColor: "rgba(43,24,52,0.6)",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.05)",
                }}
              >
                <Text className="text-2xl mb-2">🌙</Text>
                <Text className="text-white text-sm font-semibold mb-1">
                  {t("dreams.hintLucidTitle")}
                </Text>
                <Text className="text-white/50 text-xs leading-[16px]">
                  {t("dreams.hintLucidDesc")}
                </Text>
              </View>

              <View
                className="flex-1 rounded-xl p-4"
                style={{
                  backgroundColor: "rgba(43,24,52,0.6)",
                  borderWidth: 1,
                  borderColor: "rgba(166,13,242,0.15)",
                }}
              >
                <Text className="text-2xl mb-2">✨</Text>
                <Text className="text-white text-sm font-semibold mb-1">
                  {t("dreams.hintAiTitle")}
                </Text>
                <Text className="text-white/50 text-xs leading-[16px]">
                  {t("dreams.hintAiDesc")}
                </Text>
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}
