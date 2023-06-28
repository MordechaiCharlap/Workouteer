import { View, Text } from "react-native";
import React, { useCallback } from "react";
import useAuth from "../hooks/useAuth";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import CustomText from "../components/basic/CustomText";
import languageService from "../services/languageService";
import * as appStyle from "../utils/appStyleSheet";
import Header from "../components/Header";
import CustomButton from "../components/basic/CustomButton";
import useResponsiveness from "../hooks/useResponsiveness";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBug } from "@fortawesome/free-solid-svg-icons";
import { safeAreaStyle } from "../components/safeAreaStyle";

const AdminHomeScreen = () => {
  const { user } = useAuth();
  const { setCurrentScreen } = useNavbarDisplay();
  const { windowHeight } = useResponsiveness();
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("AdminHome");
    }, [])
  );

  const rowStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
  };
  const menuContainerStyle = {
    alignSelf: "center",
    width: "85%",
    height: "80%",
    justifyContent: "space-between",
  };
  const AdminButton = (props) => {
    const iconSize = windowHeight / 16.5;
    const buttonStyle = {
      backgroundColor: appStyle.color_surface_variant,
      width: windowHeight / 5.5,
      height: windowHeight / 5.5,
    };
    const textStyle = { fontSize: windowHeight / 35, textAlign: "center" };
    return (
      <CustomButton
        style={buttonStyle}
        onPress={() => {
          navigation.navigate(props.navigate);
        }}
      >
        <CustomText style={textStyle}>{props.title}</CustomText>

        <FontAwesomeIcon
          icon={props.icon}
          size={iconSize}
          color={appStyle.color_on_surface_variant}
        />
      </CustomButton>
    );
  };
  return (
    <View style={safeAreaStyle()}>
      <Header
        title={languageService[user.language].controlPanel}
        goBackOption={true}
      />
      <View style={menuContainerStyle}>
        <View style={rowStyle}>
          <AdminButton
            icon={faBug}
            title={languageService[user.language].suggestionsAndBugs}
          />
        </View>
      </View>
    </View>
  );
};

export default AdminHomeScreen;
