import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

export default function NotFound() {
  return (
    <View>
      <Text>Страница не найдена</Text>
      <Pressable onPress={() => router.replace("/")}>
        <Text style={{ color: "#4f46e5", fontSize: 16 }}>
          Вернуться на главную
        </Text>
      </Pressable>
    </View>
  );
}
