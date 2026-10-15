import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/localization/locale-provider";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  time: string;
}

export default function CoachTab() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hey! Ready for your workout today? You have Upper Body Strength scheduled.",
      isUser: false,
      time: "9:00 AM",
    },
  ]);

  const suggestions = [
    "What's my workout today?",
    "How many calories should I eat?",
    "Help me log my lunch",
    "Tips for better sleep",
  ];

  const handleSend = () => {
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: message,
      isUser: true,
      time: "Just now",
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: "That's a great question! Let me help you with that. Based on your current goals, I'd recommend focusing on proper form and progressive overload. Would you like me to suggest some specific tips?",
        isUser: false,
        time: "Just now",
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={[styles.aiAvatar, { backgroundColor: theme.aiCoachSubtle }]}>
            <Text style={styles.aiAvatarText}>🤖</Text>
          </View>
          <View>
            <Text style={[styles.title, { color: theme.foreground }]}>{t("tabs.coach")}</Text>
            <Text style={[styles.subtitle, { color: theme.foregroundMuted }]}>Always here to help</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.suggestionChip, { backgroundColor: theme.aiCoachSubtle }]}
              onPress={() => setMessage(suggestion)}
            >
              <Text style={[styles.suggestionText, { color: theme.aiCoach }]}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Messages */}
        <View style={styles.messagesContainer}>
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageBubble,
                msg.isUser ? [styles.userBubble, { backgroundColor: theme.primary }] : 
                  [styles.aiBubble, { backgroundColor: theme.surface, borderColor: theme.border }],
              ]}
            >
              {!msg.isUser && (
                <View style={styles.aiBubbleHeader}>
                  <Text style={styles.aiBubbleEmoji}>🤖</Text>
                  <Text style={[styles.aiBubbleName, { color: theme.aiCoach }]}>AI Coach</Text>
                </View>
              )}
              <Text
                style={[
                  styles.messageText,
                  msg.isUser ? styles.userText : [styles.aiText, { color: theme.foreground }],
                ]}
              >
                {msg.text}
              </Text>
              <Text style={[styles.messageTime, { color: theme.foregroundMuted }]}>{msg.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Input Area */}
      <View style={[
        styles.inputContainer, 
        { 
          backgroundColor: theme.surface, 
          borderTopColor: theme.border 
        }
      ]}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.background,
              color: theme.foreground,
            },
          ]}
          placeholder="Ask your AI Coach..."
          placeholderTextColor={theme.foregroundMuted}
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendButton, 
            { backgroundColor: theme.primary },
            !message.trim() && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  aiAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  aiAvatarText: {
    fontSize: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  suggestionChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  suggestionText: {
    fontSize: 13,
    fontWeight: "500",
  },
  messagesContainer: {
    gap: 16,
  },
  messageBubble: {
    maxWidth: "85%",
    padding: 16,
    borderRadius: 20,
  },
  userBubble: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  aiBubbleHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  aiBubbleEmoji: {
    fontSize: 16,
  },
  aiBubbleName: {
    fontSize: 12,
    fontWeight: "600",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  userText: {
    color: "#FFFFFF",
  },
  aiText: {},
  messageTime: {
    fontSize: 10,
    marginTop: 6,
    alignSelf: "flex-end",
  },
  inputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    borderRadius: 24,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
