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
import { StyleSheet } from "react-native-unistyles";
import { getOnboardingSlides } from "../src/onboardingSlides";

/* ================= CONST ================= */

const DOT_SIZE = 8;
const DOT_GAP = 10;
const DOT_ACTIVE_WIDTH = 20;

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
    <View style={styles.container}>
      {/* Progress */}
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
      </View>

      {/* Skip */}
      {!SLIDES[index].final && (
        <Pressable style={styles.skip} onPress={finish}>
          <Text style={styles.skipText}>{t("onboarding.skip")}</Text>
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
            <View style={styles.slide}>
              {item.final ? (
                <>
                  <View style={styles.permissionIcon}>
                    <Ionicons name="notifications" size={90} color="white" />
                  </View>

                  <Text style={styles.permissionTitle}>{item.title}</Text>

                  <Text style={styles.permissionDescription}>
                    {item.description}
                  </Text>

                  <Text style={styles.permissionHint}>{item.hint}</Text>
                </>
              ) : (
                <>
                  <Animated.View
                    style={{ transform: [{ translateY: floatAnim }] }}
                  >
                    <View style={styles.imageWrapper}>
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

                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                </>
              )}
            </View>
          </View>
        )}
      />

      {/* Bottom */}
      <View style={styles.bottom}>
        {/* Dots */}
        <View style={styles.dotsWrapper}>
          <View style={[styles.dotsContainer, { width: DOTS_WIDTH }]}>
            <View style={styles.dotsRow}>
              {SLIDES.map((_, i) => (
                <View key={i} style={styles.dot} />
              ))}
            </View>

            <Animated.View
              style={[
                styles.activeDot,
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
            style={styles.button}
          >
            <Text style={styles.buttonText}>
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

/* ================= STYLES ================= */

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  progressTrack: {
    height: 4,
    backgroundColor: theme.colors.surfaceAlt,
  },

  progressBar: {
    height: 4,
    backgroundColor: theme.colors.tint,
  },

  skip: {
    position: "absolute",
    top: 52,
    right: 24,
    zIndex: 10,
  },

  skipText: {
    color: theme.colors.dimmed,
    fontSize: 14,
    fontWeight: "600",
  },

  slide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  imageWrapper: {
    width: 260,
    height: 260,
    borderRadius: 32,
    marginBottom: 28,
    shadowColor: theme.colors.tint,
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 10,
  },

  title: {
    color: theme.colors.typography,
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 14,
    lineHeight: 36,
  },

  description: {
    // близко к твоему #d1d5db, но завязано на тему
    color: theme.colors.dimmed,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 300,
  },

  permissionIcon: {
    width: 160,
    height: 160,
    borderRadius: 80,
    // было rgba(166,13,242,0.15) - делаем через tint
    backgroundColor: "rgba(166,13,242,0.15)" as any,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },

  permissionTitle: {
    color: theme.colors.typography,
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 34,
  },

  permissionDescription: {
    color: theme.colors.dimmed,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 300,
    marginBottom: 16,
  },

  permissionHint: {
    color: theme.colors.dimmed,
    fontSize: 13,
    textAlign: "center",
    opacity: 0.8,
  },

  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },

  dotsWrapper: {
    alignItems: "center",
    marginBottom: 16,
  },

  dotsContainer: {
    height: 8,
    position: "relative",
  },

  dotsRow: {
    flexDirection: "row",
  },

  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    // было #563168
    backgroundColor: theme.colors.surfaceAlt,
    marginRight: DOT_GAP,
    opacity: 0.9,
  },

  activeDot: {
    position: "absolute",
    left: -6,
    width: DOT_ACTIVE_WIDTH,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: theme.colors.tint,
  },

  button: {
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.tint,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: 300,
    alignSelf: "center",
    gap: 8,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
}));
