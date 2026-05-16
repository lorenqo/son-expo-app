import { useButtonAnimation } from "@/hooks/useButtonAnimation";
import { useScreenAnimation } from "@/hooks/useScreenAnimation";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NEON_SHADOW = {
  shadowColor: "#A60DF2",
  shadowOpacity: 0.5,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 0 },
  elevation: 8,
} as const;

type Message = { id: string; role: "user" | "ai"; text: string };

const QUICK_ACTIONS = ["Суммировать", "Сохранить символы", "Подробнее"];

function UserBubble({ text }: { text: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: 12,
      }}
    >
      <View
        style={{
          backgroundColor: "#3F274C",
          borderRadius: 18,
          borderBottomRightRadius: 4,
          paddingHorizontal: 16,
          paddingVertical: 12,
          maxWidth: "82%",
        }}
      >
        <Text style={{ color: "white", fontSize: 14, lineHeight: 20 }}>
          {text}
        </Text>
      </View>
    </View>
  );
}

function AiBubble({ text, isLast }: { text: string; isLast: boolean }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
        <View
          style={{
            backgroundColor: "rgba(166,13,242,0.1)",
            borderWidth: 1,
            borderColor: "rgba(166,13,242,0.25)",
            borderRadius: 18,
            borderBottomLeftRadius: 4,
            paddingHorizontal: 16,
            paddingVertical: 12,
            maxWidth: "82%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              marginBottom: 8,
            }}
          >
            <Ionicons name="flash" size={11} color="#A60DF2" />
            <Text
              style={{
                color: "#A60DF2",
                fontSize: 10,
                fontWeight: "700",
                letterSpacing: 1.2,
                textTransform: "uppercase",
              }}
            >
              Интерпретация
            </Text>
          </View>
          <Text style={{ color: "white", fontSize: 14, lineHeight: 20 }}>
            {text}
          </Text>
        </View>
      </View>

      {isLast && (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 10,
          }}
        >
          {QUICK_ACTIONS.map((action) => (
            <Pressable
              key={action}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.05)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <Text
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: 12,
                  fontWeight: "600",
                }}
              >
                {action}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

export default function Chat() {
  const screen = useScreenAnimation();
  const backBtn = useButtonAnimation(1.06);
  const sendBtn = useButtonAnimation(1.08);

  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", text },
    ]);
    setInput("");
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#1C1022" }}
      behavior="padding"
      keyboardVerticalOffset={insets.bottom - 40}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Animated.View
          style={{
            flex: 1,
            opacity: screen.opacity,
            transform: [{ translateY: screen.translateY }],
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: "rgba(255,255,255,0.05)",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
            >
              <Animated.View style={{ transform: [{ scale: backBtn.scale }] }}>
                <Pressable
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.08)",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => router.back()}
                  onPressIn={backBtn.pressIn}
                  onPressOut={backBtn.pressOut}
                  onHoverIn={backBtn.hoverIn}
                  onHoverOut={backBtn.hoverOut}
                >
                  <Ionicons name="chevron-back" size={20} color="#B790CB" />
                </Pressable>
              </Animated.View>

              <Text
                style={{
                  color: "#A60DF2",
                  fontSize: 18,
                  fontWeight: "700",
                  textShadowColor: "rgba(166,13,242,0.6)",
                  textShadowOffset: { width: 0, height: 0 },
                  textShadowRadius: 12,
                }}
              >
                Morpheus AI
              </Text>
            </View>

            <Ionicons
              name="person-circle-outline"
              size={26}
              color="rgba(255,255,255,0.4)"
            />
          </View>

          {/* Empty state */}
          {messages.length === 0 && (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 32,
              }}
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={48}
                color="rgba(166,13,242,0.4)"
              />
              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "700",
                  marginTop: 16,
                  marginBottom: 8,
                  textAlign: "center",
                }}
              >
                Расскажите о своём сне
              </Text>
              <Text
                style={{
                  color: "#B790CB",
                  fontSize: 14,
                  textAlign: "center",
                  lineHeight: 20,
                }}
              >
                Morpheus AI поможет разгадать символы и скрытые смыслы
              </Text>
            </View>
          )}

          {/* Messages list */}
          {messages.length > 0 && (
            <ScrollView
              ref={scrollRef}
              style={{ flex: 1 }}
              contentContainerStyle={{ padding: 16, paddingBottom: 12 }}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() =>
                scrollRef.current?.scrollToEnd({ animated: false })
              }
            >
              {messages.map((msg, i) =>
                msg.role === "user" ? (
                  <UserBubble key={msg.id} text={msg.text} />
                ) : (
                  <AiBubble
                    key={msg.id}
                    text={msg.text}
                    isLast={i === messages.length - 1}
                  />
                ),
              )}
            </ScrollView>
          )}

          {/* Input bar */}
          <View
            style={{
              marginHorizontal: 16,
              marginBottom: 16,
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 999,
              paddingHorizontal: 8,
              paddingVertical: 6,
              backgroundColor: "rgba(43,24,52,0.9)",
              borderWidth: 1,
              borderColor: "rgba(166,13,242,0.2)",
            }}
          >
            <Ionicons
              name="add-circle-outline"
              size={26}
              color="rgba(255,255,255,0.3)"
              style={{ marginLeft: 4 }}
            />
            <TextInput
              style={{
                flex: 1,
                color: "white",
                fontSize: 14,
                paddingHorizontal: 10,
                paddingVertical: 8,
                ...(Platform.OS === "web" ? ({ outline: "none" } as any) : {}),
              }}
              placeholder="Спросите Morpheus..."
              placeholderTextColor="rgba(255,255,255,0.35)"
              value={input}
              onChangeText={setInput}
              returnKeyType="send"
              onSubmitEditing={sendMessage}
            />
            <Animated.View style={{ transform: [{ scale: sendBtn.scale }] }}>
              <Pressable
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#A60DF2",
                  alignItems: "center",
                  justifyContent: "center",
                  ...NEON_SHADOW,
                }}
                onPressIn={sendBtn.pressIn}
                onPressOut={sendBtn.pressOut}
                onHoverIn={sendBtn.hoverIn}
                onHoverOut={sendBtn.hoverOut}
                onPress={sendMessage}
              >
                <Ionicons name="send" size={15} color="white" />
              </Pressable>
            </Animated.View>
          </View>
        </Animated.View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
