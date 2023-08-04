import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "../../components/basic/CustomButton";
import CustomText from "../../components/basic/CustomText";
const TestScreen = () => {
  const [systemVolume, setSystemVolume] = useState(0);
  const showVolume = () => {};
  return (
    <View className="flex-1 justify-center">
      <CustomText className="text-center text-4xl">{systemVolume}</CustomText>
      <CustomButton onPress={showVolume}>
        <CustomText>TESTButton</CustomText>
      </CustomButton>
    </View>
  );
};

export default TestScreen;
