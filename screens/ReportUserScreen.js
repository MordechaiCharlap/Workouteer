import { View, Text } from "react-native";
import React from "react";

const ReportUserScreen = ({ route }) => {
  const { reporter, reported } = route.params;
  console.log(reporter);
  console.log(reported);
  return (
    <View>
      <Text>ReportUserScreen</Text>
    </View>
  );
};

export default ReportUserScreen;
