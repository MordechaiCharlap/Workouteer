import { View, Text, Image } from "react-native";
import React, { useCallback } from "react";
import { safeAreaStyle } from "../components/safeAreaStyle";
import * as appStyle from "../utils/appStyleSheet";
import useAuth from "../hooks/useAuth";
import languageService from "../services/languageService";
import { useFocusEffect } from "@react-navigation/native";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import appComponentsDefaultStyles from "../utils/appComponentsDefaultStyles";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPersonDigging } from "@fortawesome/free-solid-svg-icons";
const UnderMaintenanceScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  const { user } = useAuth();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("UnderMaintenance");
    }, [])
  );
  return (
    <View
      className="justify-center flex-1 items-center gap-y-4 px-4"
      style={{ backgroundColor: appStyle.color_surface_variant }}
    >
      <View
        className="rounded-lg p-2 gap-y-5 self-center w-11/12 items-center"
        style={[
          {
            backgroundColor: appStyle.color_surface,
            borderWidth: 0.5,
            borderColor: appStyle.color_outline,
          },
          appComponentsDefaultStyles.shadow,
        ]}
      >
        <Image
          className="w-20 h-20"
          source={require("../assets/app-icon.png")}
        />
        {/* <FontAwesomeIcon
          icon={faPersonDigging}
          color={appStyle.color_on_surface}
          size={50}
        /> */}
        <Text
          className="text-3xl text-center font-bold"
          style={{ color: appStyle.color_on_surface }}
        >
          {user
            ? languageService[user.language].appIsUnderMaintenance
            : "The app is currently under maintenance"}
        </Text>
        <Text
          className="text-xl text-center"
          style={{ color: appStyle.color_on_surface }}
        >
          {user
            ? languageService[user.language].comeBackLater
            : "Come back later :)"}
        </Text>
      </View>
    </View>
  );
};

export default UnderMaintenanceScreen;
