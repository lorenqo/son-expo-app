import { useRef } from "react";
import { Animated } from "react-native";

export const useButtonAnimation = (hoverScale = 1.03) => {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  const hoverIn = () => {
    Animated.spring(scale, {
      toValue: hoverScale,
      useNativeDriver: true,
      speed: 18,
      bounciness: 4,
    }).start();
  };

  const hoverOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 18,
      bounciness: 4,
    }).start();
  };

  return { scale, pressIn, pressOut, hoverIn, hoverOut };
};
