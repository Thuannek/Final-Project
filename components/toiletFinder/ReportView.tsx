import { IconSymbol } from "@/components/ui/IconSymbol";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ISSUE_TYPES = [
  { id: "closed", label: "Toilet is closed/out of service" },
  { id: "dirty", label: "Toilet is unclean" },
  { id: "damaged", label: "Toilet is damaged" },
  { id: "incorrect", label: "Information is incorrect" },
  { id: "other", label: "Other issue" },
];

interface ReportViewProps {
  onBack: () => void;
  toiletId: number;
  toiletName: string;
}

export function ReportView({ onBack, toiletId, toiletName }: ReportViewProps) {
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!selectedIssue) {
      Alert.alert("Error", "Please select an issue type");
      return;
    }

    // In a real app, you would send this data to your backend
    console.log({
      toiletId,
      issueType: selectedIssue,
      description,
      timestamp: new Date().toISOString(),
    });

    Alert.alert(
      "Thank you",
      "Your report has been submitted. We'll review it shortly.",
      [{ text: "OK", onPress: onBack }]
    );
  };

  return (
    <ScrollView className="px-6">
      <TouchableOpacity onPress={onBack} className="flex-row items-center mb-2">
        <IconSymbol name="close" size={30} color="#3b82f6" />
      </TouchableOpacity>

      <View className="mb-6">
        <Text className="text-xl font-bold mb-1">Report an Issue</Text>
        <Text className="text-gray-500">{toiletName}</Text>
      </View>

      <Text className="font-semibold mb-3">What's the issue?</Text>

      {ISSUE_TYPES.map((issue) => (
        <TouchableOpacity
          key={issue.id}
          onPress={() => setSelectedIssue(issue.id)}
          className={`flex-row items-center p-3 mb-2 rounded-lg border ${
            selectedIssue === issue.id
              ? "bg-indigo-100 border-indigo-800"
              : "bg-gray-100 border-gray-300"
          }`}
        >
          <View className="flex-1">
            <Text className="font-medium">{issue.label}</Text>
          </View>
          {selectedIssue === issue.id && (
            <IconSymbol name="checkmark" size={24} color="#37f" />
          )}
        </TouchableOpacity>
      ))}

      <View className="mt-4 mb-6">
        <Text className="font-semibold mb-2">
          Additional details (optional)
        </Text>
        <TextInput
          className="bg-gray-100 p-3 rounded-lg border border-gray-300 min-h-[100px]"
          multiline
          placeholder="Please provide any relevant details that will help us address this issue..."
          value={description}
          onChangeText={setDescription}
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        className="p-4 rounded-xl flex-row justify-center items-center gap-2 bg-blue-900 mb-6"
      >
        <Text className="text-white text-lg font-semibold">Submit Report</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
