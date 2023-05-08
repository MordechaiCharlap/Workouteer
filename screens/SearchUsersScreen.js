import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from "react-native";
import { React, useCallback, useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { safeAreaStyle } from "../components/safeAreaStyle";
import * as appStyle from "../utilities/appStyleSheet";
import useAuth from "../hooks/useAuth";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import SearchUsers from "../components/SearchUsers";

const SearchUsersScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();

  const { user } = useAuth();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("SearchUsers");
    }, [])
  );
  return (
    <View style={safeAreaStyle()}>
      <View className="px-2">
        <SearchUsers language={user.language} />
      </View>
    </View>
  );
};
const style = StyleSheet.create({
  profileImg: {
    borderColor: appStyle.color_primary,
    borderWidth: 0.1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0 /* Make the picture taking the size of it's parent */,
    // width: "100%" /* This if for the object-fit */,
    width: "100%" /* This if for the object-fit */,
    objectFit:
      "cover" /* Equivalent of the background-size: cover; of a background-image */,
    objectPosition: "center",
  },
});
export default SearchUsersScreen;
