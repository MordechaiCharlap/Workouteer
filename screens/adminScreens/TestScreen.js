import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "../../components/basic/CustomButton";
import CustomText from "../../components/basic/CustomText";
import { color_on_primary, color_primary } from "../../utils/appStyleSheet";
import useFirebase from "../../hooks/useFirebase";
import { doc, updateDoc } from "firebase/firestore";
const TestScreen = () => {
  const { db } = useFirebase();
  const testButtonFunction = () => {
    updateDoc(doc(db, "alerts/charlap"), {
      chats: {},
      friendRequests: {},
      workoutInvites: {},
      workoutRequests: {},
      newWorkouts: {},
    });
  };
  return (
    <View className="flex-1 justify-center items-center">
      <CustomButton
        style={{ backgroundColor: color_primary }}
        onPress={testButtonFunction}
      >
        <CustomText style={{ color: color_on_primary }}>TestButton</CustomText>
      </CustomButton>
    </View>
  );
};

export default TestScreen;
