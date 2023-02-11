import { View, StatusBar } from "react-native";
import { React, useState, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import * as appStyle from "../components/AppStyleSheet";
import * as firebase from "../services/firebase";
import responsiveStyle from "../components/ResponsiveStyling";
import SearchUsers from "../components/SearchUsers";
import Explore from "../components/Explore";
import useAuth from "../hooks/useAuth";
import useNavbarNavigation from "../hooks/useNavbarNavigation";
import useNavbarDisplay from "../hooks/useNavbarDisplay";

const ExploreScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  const { setScreen } = useNavbarNavigation();

  const navigation = useNavigation();
  const { user } = useAuth();

  const [renderOption, setRenderOption] = useState("Explore");
  const [searchInputEmpty, setSearchInputEmpty] = useState(true);
  useFocusEffect(
    useCallback(() => {
      setScreen("Explore");
      setCurrentScreen("Explore");
    }, [])
  );
  const userClicked = async (userData) => {
    const friendshipStatus = await firebase.checkFriendShipStatus(
      user,
      userData.id
    );
    navigation.navigate("User", {
      shownUser: userData,
      friendshipStatus: friendshipStatus,
    });
  };
  return (
    <View style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <View className="flex-1">
        {renderOption == "Explore" && (
          <SearchUsers
            language={user.language}
            userClicked={userClicked}
            isEmpty={(isEmpty) => setSearchInputEmpty(isEmpty)}
          />
        )}
        {renderOption == "Explore" && searchInputEmpty == true && <Explore />}
      </View>
    </View>
  );
};
export default ExploreScreen;
