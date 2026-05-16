import { useAuth } from "@/store/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ErrorBoundaryProps, useRouter } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      <Text>{error.message}</Text>
      <Text onPress={retry}>Try Again?</Text>
    </View>
  );
}

export default function Index() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    AsyncStorage.getItem("onboardingCompleted").then((value) => {
      if (value !== "true") {
        router.replace("/onboarding");
      } else {
        router.replace("/(tabs)");
      }
    });
  }, []);

  return (
    <View className="flex-1 bg-[#1C1022] items-center justify-center">
      <SafeAreaView className="flex-1 bg-transparent">
        <View className="flex-1 items-center justify-center px-6 py-8">
          <Text className="text-white text-[26px] font-bold tracking-[-0.3px] mb-[10px] text-center">
            {t("index.title")}
          </Text>

          <Text className="text-[#B790CB] text-[15px] leading-[22px] text-center max-w-[280px] mb-6">
            {user
              ? `${t("index.loginedUs")} ${user.name}`
              : t("index.notLogined")}
          </Text>

          <Pressable onPress={() => AsyncStorage.clear()}>
            <Text className="text-[#F87171] text-[12px] font-semibold tracking-[0.4px]">
              RESET STORAGE
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
