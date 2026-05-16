import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  Text,
  UIManager,
  View,
} from "react-native";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export type PickerItem = { value: string; label: string };

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBgClass: string;
  label: string;
  value: string;
  items: PickerItem[];
  onSelect: (value: string) => void;
  borderBottom?: boolean;
};

const ITEM_H = 48;
const BORDER = {
  borderBottomWidth: 1,
  borderBottomColor: "rgba(255,255,255,0.05)",
};

export function PickerRow({
  icon,
  iconColor,
  iconBgClass,
  label,
  value,
  items,
  onSelect,
  borderBottom = true,
}: Props) {
  const [open, setOpen] = useState(false);
  const chevronRot = useRef(new Animated.Value(0)).current;
  const maxH = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rowScale = useRef(new Animated.Value(1)).current;

  const totalH = items.length * ITEM_H;

  const toggle = () => {
    const opening = !open;
    setOpen(opening);

    // height slide (JS driver — layout property)
    Animated.timing(maxH, {
      toValue: opening ? totalH : 0,
      duration: opening ? 260 : 200,
      easing: opening ? Easing.out(Easing.cubic) : Easing.in(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // opacity fade (native driver)
    Animated.timing(opacity, {
      toValue: opening ? 1 : 0,
      duration: opening ? 220 : 140,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();

    // chevron rotation (native driver)
    Animated.spring(chevronRot, {
      toValue: opening ? 1 : 0,
      useNativeDriver: true,
      bounciness: 0,
      speed: 18,
    }).start();
  };

  const pressIn = () =>
    Animated.spring(rowScale, {
      toValue: 0.98,
      useNativeDriver: true,
      bounciness: 0,
      speed: 30,
    }).start();

  const pressOut = () =>
    Animated.spring(rowScale, {
      toValue: 1,
      useNativeDriver: true,
      bounciness: 0,
      speed: 30,
    }).start();

  const chevronRotate = chevronRot.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  const selectedLabel = items.find((i) => i.value === value)?.label ?? value;

  return (
    <>
      <Animated.View style={{ transform: [{ scale: rowScale }] }}>
        <Pressable
          className="flex-row items-center justify-between p-4"
          style={borderBottom ? BORDER : undefined}
          onPress={toggle}
          onPressIn={pressIn}
          onPressOut={pressOut}
        >
          <View className="flex-row items-center gap-4">
            <View
              className={`w-10 h-10 rounded-lg ${iconBgClass} items-center justify-center`}
            >
              <Ionicons name={icon} size={20} color={iconColor} />
            </View>
            <Text className="text-base font-medium text-white">{label}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-sm text-white/50">{selectedLabel}</Text>
            <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
              <Ionicons
                name="chevron-forward"
                size={18}
                color="rgba(255,255,255,0.3)"
              />
            </Animated.View>
          </View>
        </Pressable>
      </Animated.View>

      {/* Outer: animates height (JS driver) */}
      <Animated.View
        style={[BORDER, { maxHeight: maxH, overflow: "hidden" }]}
        pointerEvents={open ? "auto" : "none"}
      >
        {/* Inner: animates opacity (native driver) */}
        <Animated.View style={{ opacity }}>
          {items.map((item) => (
            <ItemRow
              key={item.value}
              item={item}
              active={value === item.value}
              onPress={() => {
                onSelect(item.value);
                toggle();
              }}
            />
          ))}
        </Animated.View>
      </Animated.View>
    </>
  );
}

function ItemRow({
  item,
  active,
  onPress,
}: {
  item: PickerItem;
  active: boolean;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () =>
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      bounciness: 0,
      speed: 30,
    }).start();

  const pressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      bounciness: 0,
      speed: 30,
    }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        className="flex-row items-center justify-between px-4 py-3 pl-[72px]"
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
      >
        <Text
          className={`text-sm ${active ? "text-[#A60DF2] font-semibold" : "text-white/70"}`}
        >
          {item.label}
        </Text>
        {active && <Ionicons name="checkmark" size={16} color="#A60DF2" />}
      </Pressable>
    </Animated.View>
  );
}
