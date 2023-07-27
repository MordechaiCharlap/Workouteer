import { View, Text } from "react-native";
import { React, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { safeAreaStyle } from "../components/safeAreaStyle";
import useAuth from "../hooks/useAuth";
import useNavbarNavigation from "../hooks/useNavbarNavigation";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import LatestWorkouts from "../components/exploreScreen/LatestWorkouts";
import SuggestedUsers from "../components/exploreScreen/SuggestedUsers";

const ExploreScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  const { setScreen } = useNavbarNavigation();
  const { user } = useAuth();
  const [searchInputEmpty, setSearchInputEmpty] = useState(true);
  useFocusEffect(
    useCallback(() => {
      setScreen("Explore");
      setCurrentScreen("Explore");
    }, [])
  );

  return (
    <View style={[safeAreaStyle()]}>
      {/* <SearchUsers language={user.language} setIsEmpty={setSearchInputEmpty} /> */}
      <SuggestedUsers />
      {searchInputEmpty == true && <LatestWorkouts />}
    </View>
  );
};
export default ExploreScreen;
