import { Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps, Tabs } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Animated, Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Defs, FeGaussianBlur, Filter, Rect } from "react-native-svg";
import { useRef } from "react";

const ICONS: Record<string, { active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }> = {
  index: { active: "home", inactive: "home-outline" },
  dreams: { active: "moon", inactive: "moon-outline" },
  settings: { active: "settings", inactive: "settings-outline" },
  profile: { active: "person", inactive: "person-outline" },
};

const SPREAD = 28;

function TabItem({
  label,
  routeName,
  isFocused,
  onPress,
}: {
  label: string;
  routeName: string;
  isFocused: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () =>
    Animated.spring(scale, { toValue: 0.88, useNativeDriver: true, bounciness: 0, speed: 40 }).start();
  const pressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 0, speed: 40 }).start();

  const icons = ICONS[routeName] ?? { active: "ellipse", inactive: "ellipse-outline" };
  const color = isFocused ? "#A60DF2" : "rgba(255,255,255,0.4)";

  return (
    <Animated.View style={{ flex: 1, transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 8,
          paddingHorizontal: 2,
          borderRadius: 999,
          backgroundColor: isFocused ? "rgba(255,255,255,0.06)" : "transparent",
        }}
      >
        <Ionicons
          name={isFocused ? icons.active : icons.inactive}
          size={22}
          color={color}
        />
        <Text
          numberOfLines={1}
          style={{
            fontSize: 8,
            fontWeight: "700",
            color,
            textTransform: "uppercase",
            letterSpacing: 0,
            marginTop: 3,
          }}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const [size, setSize] = useState({ w: 0, h: 0 });

  return (
    <View
      style={{
        position: "absolute",
        bottom: insets.bottom + 12,
        left: 16,
        right: 16,
        overflow: "visible",
      }}
    >
      {/* True Gaussian blur neon glow via SVG feGaussianBlur — works on iOS & Android */}
      {size.w > 0 && (
        <Svg
          pointerEvents="none"
          style={{ position: "absolute", top: -SPREAD, left: -SPREAD }}
          width={size.w + SPREAD * 2}
          height={size.h + SPREAD * 2}
        >
          <Defs>
            <Filter id="neon" x="-100%" y="-100%" width="300%" height="300%">
              <FeGaussianBlur stdDeviation="10" in="SourceGraphic" />
            </Filter>
          </Defs>
          {/* Glow shape — blurred copy of the tab bar pill */}
          <Rect
            x={SPREAD}
            y={SPREAD}
            width={size.w}
            height={size.h}
            rx={size.h / 2}
            fill="rgba(166,13,242,0.55)"
            filter="url(#neon)"
          />
        </Svg>
      )}

      {/* Tab bar */}
      <View
        onLayout={(e) =>
          setSize({ w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height })
        }
        style={{
          flexDirection: "row",
          backgroundColor: "rgba(43, 24, 52, 0.96)",
          borderRadius: 999,
          paddingVertical: 6,
          paddingHorizontal: 4,
          borderWidth: 1,
          borderColor: "rgba(166,13,242,0.35)",
        }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabItem
              key={route.key}
              label={label}
              routeName={route.name}
              isFocused={isFocused}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: t("index.tab_name") }}
      />
      <Tabs.Screen
        name="dreams"
        options={{ title: t("dreams.tab_name") }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: t("settings.tab_name") }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: t("profile.tab_name") }}
      />
    </Tabs>
  );

}
