import { Ionicons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "expo-image";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Dimensions,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { getOnboardingSlides } from "../src/onboardingSlides";

/* ================= CONST ================= */

const DOT_SIZE = 8;
const DOT_GAP = 12;
const DOT_ACTIVE_WIDTH = 17;

const DOT_STEP = DOT_SIZE + DOT_GAP;

const { width, height } = Dimensions.get("window");
const TOP_OFFSET = 100;
const BOTTOM_OFFSET = 120;
const SLIDE_HEIGHT = height - TOP_OFFSET - BOTTOM_OFFSET;

/* ================= COMPONENT ================= */

export default function Onboarding() {
  const { t } = useTranslation();
  const SLIDES = getOnboardingSlides(t);
  const DOTS_WIDTH = DOT_STEP * (SLIDES.length - 1) + DOT_ACTIVE_WIDTH;
  const router = useRouter();
  const listRef = useRef<FlatList>(null);

  const [index, setIndex] = useState(0);

  const floatAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const dotsAnim = useRef(new Animated.Value(0)).current;

  const buttonScale = useRef(new Animated.Value(1)).current;
  const animateTo = (value: number) => {
    Animated.timing(buttonScale, {
      toValue: value,
      duration: 120,
      useNativeDriver: true,
    }).start();
  };

  /* ===== FLOAT ANIMATION ===== */
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  /* ===== PROGRESS ===== */
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (index + 1) / SLIDES.length,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(dotsAnim, {
      toValue: index,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [index]);

  /* ===== VIEWABILITY ===== */
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: any[] }) => {
      if (viewableItems[0]?.index != null) {
        setIndex(viewableItems[0].index);
      }
    },
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  /* ===== ACTIONS ===== */

  const finish = async () => {
    try {
      await Notifications.requestPermissionsAsync();
    } catch {}

    await AsyncStorage.setItem("onboardingCompleted", "true");
    router.replace("/login");
  };

  const goToIndex = (i: number) => {
    setIndex(i);
    listRef.current?.scrollToIndex({ index: i, animated: true });
  };

  const next = () => {
    if (SLIDES[index].final) {
      finish();
    } else {
      goToIndex(index + 1);
    }
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  /* ================= RENDER ================= */

  return (
    <View className="flex-1 bg-[#1C1022]">
      {/* Progress */}
      <View className="h-1 bg-[#24152B]">
        <Animated.View
          className="h-1 bg-[#A60DF2]"
          style={{ width: progressWidth }}
        />
      </View>

      {/* Skip */}
      {!SLIDES[index].final && (
        <Pressable
          className="absolute top-[52px] right-6 z-10"
          onPress={finish}
        >
          <Text className="text-[#B790CB] text-sm font-semibold">
            {t("onboarding.skip")}
          </Text>
        </Pressable>
      )}

      {/* Slides */}
      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        getItemLayout={(_, i) => ({
          length: width,
          offset: width * i,
          index: i,
        })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => (
          <View style={{ width, height: SLIDE_HEIGHT }}>
            <View className="flex-1 justify-center items-center px-6">
              {item.final ? (
                <>
                  <View className="w-40 h-40 rounded-full justify-center items-center mb-8 bg-[#A60DF2]/15">
                    <Ionicons name="notifications" size={90} color="white" />
                  </View>

                  <Text className="text-white text-[28px] font-bold text-center mb-4 leading-[34px]">
                    {item.title}
                  </Text>

                  <Text className="text-[#B790CB] text-[15px] text-center leading-[22px] max-w-[300px] mb-4">
                    {item.description}
                  </Text>

                  <Text className="text-[#B790CB] text-[13px] text-center opacity-80">
                    {item.hint}
                  </Text>
                </>
              ) : (
                <>
                  <Animated.View
                    style={{ transform: [{ translateY: floatAnim }] }}
                  >
                    <View
                      style={{
                        width: 260,
                        height: 260,
                        borderRadius: 32,
                        marginBottom: 28,
                        shadowColor: "#A60DF2",
                        shadowOpacity: 0.35,
                        shadowRadius: 24,
                        elevation: 10,
                      }}
                    >
                      <Image
                        source={item.image}
                        contentFit="contain"
                        transition={250}
                        style={{
                          width: 260,
                          height: 260,
                          borderRadius: 32,
                        }}
                      />
                    </View>
                  </Animated.View>

                  <Text className="text-white text-[30px] font-bold text-center mb-[14px] leading-[36px]">
                    {item.title}
                  </Text>
                  <Text className="text-[#B790CB] text-[15px] text-center leading-[22px] max-w-[300px]">
                    {item.description}
                  </Text>
                </>
              )}
            </View>
          </View>
        )}
      />

      {/* Bottom */}
      <View className="px-6 pb-8">
        {/* Dots */}
        <View className="items-center mb-4">
          <View
            style={{
              width: DOTS_WIDTH,
              height: DOT_SIZE,
              position: "relative",
            }}
          >
            <View className="flex-row">
              {SLIDES.map((_, i) => (
                <View
                  key={i}
                  className="w-2 h-2 rounded-full bg-[#24152B] opacity-90"
                  style={{ marginRight: DOT_GAP }}
                />
              ))}
            </View>

            <Animated.View
              style={[
                {
                  position: "absolute",
                  top: 0,
                  left: -6,
                  width: DOT_ACTIVE_WIDTH,
                  height: DOT_SIZE,
                  borderRadius: DOT_SIZE / 2,
                  backgroundColor: "#A60DF2",
                },
                {
                  transform: [
                    {
                      translateX: dotsAnim.interpolate({
                        inputRange: [0, SLIDES.length - 1],
                        outputRange: [0, DOT_STEP * (SLIDES.length - 1)],
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>
        </View>

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <Pressable
            onPress={next}
            onPressIn={() => animateTo(0.96)}
            onPressOut={() => animateTo(1)}
            className="h-14 rounded-full bg-[#A60DF2] items-center justify-center flex-row w-[300px] self-center gap-2"
          >
            <Text className="text-white text-[18px] font-bold">
              {SLIDES[index].final
                ? t("onboarding.start")
                : t("onboarding.next")}
            </Text>

            {!SLIDES[index].final && (
              <AntDesign name="arrow-right" size={20} color="#fff" />
            )}
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}
