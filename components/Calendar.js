import { View, Text } from "react-native";
import React from "react";
import languageService from "../services/languageService";
import useAuth from "../hooks/useAuth";
const Calendar = (props) => {
  const { user } = useAuth();
  const weekdays = languageService[user.language].weekdays;
  const today = new Date();
  return (
    <View>
      <Text>{weekdays[today.getDay()]}</Text>
      <View>
        <View className="flex-row"></View>
      </View>
    </View>
  );
};

export default Calendar;
