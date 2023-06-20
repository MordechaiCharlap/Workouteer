import { View, Text } from "react-native";
import React, { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import CustomButton from "../components/basic/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import * as appStlye from "../utilities/appStyleSheet";
const IntervalTimerScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("IntervalTimer");
    }, [])
  );
  return (
    <View style={{ flex: 1, backgroundColor: appStlye.color_primary }}>
      <CustomButton>
        <FontAwesomeIcon
          icon={faPlayCircle}
          color={appStlye.color_on_background}
          size={40}
        />
      </CustomButton>
    </View>
  );
};

export default IntervalTimerScreen;
