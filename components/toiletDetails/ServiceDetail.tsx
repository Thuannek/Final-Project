import { Toilet } from "@/models/toilet";
import React from "react";
import { Text, View } from "react-native";

interface ServiceDetailProps {
  toilet?: Toilet;
}

export const ServiceDetail: React.FC<ServiceDetailProps> = ({ toilet }) => {
  return (
    <>
      <View className="mt-6">
        <Text className="font-bold text-lg mb-2">Operating Hours</Text>
        <Text>
          Monday - Friday:{" "}
          {toilet?.operatingHours?.weekdays || "8:00 AM - 9:00 PM"}
        </Text>
        <Text>
          Weekends: {toilet?.operatingHours?.weekends || "10:00 AM - 6:00 PM"}
        </Text>
      </View>
      <View className="mt-6">
        <Text className="font-bold text-lg mb-2">Service Fees</Text>
        <Text>
          {toilet?.hasFee
            ? "This toilet requires a fee"
            : "This toilet is free to use"}
        </Text>
      </View>
    </>
  );
};
