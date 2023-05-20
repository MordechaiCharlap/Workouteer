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
export default SearchUsersScreen;
