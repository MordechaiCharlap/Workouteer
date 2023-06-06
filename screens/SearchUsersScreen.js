import { View } from "react-native";
import { React, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { safeAreaStyle } from "../components/safeAreaStyle";
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
