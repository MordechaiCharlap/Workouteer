import { View, Text } from "react-native";
import { React, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { safeAreaStyle } from "../components/safeAreaStyle";
import useAuth from "../hooks/useAuth";
import useNavbarNavigation from "../hooks/useNavbarNavigation";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import LatestWorkouts from "../components/exploreScreen/LatestWorkouts";
import SuggestedUsers from "../components/exploreScreen/SuggestedUsers";
import {
  color_on_surface_variant,
  color_surface_variant,
} from "../utils/appStyleSheet";

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
  const containerColor = color_surface_variant;
  const onContainerColor = color_on_surface_variant;
  return (
    <View style={[safeAreaStyle(), { rowGap: 10 }]}>
      {/* <SearchUsers language={user.language} setIsEmpty={setSearchInputEmpty} /> */}
      <SuggestedUsers
        onContainerColor={onContainerColor}
        containerColor={containerColor}
      />
      {searchInputEmpty == true && <LatestWorkouts />}
    </View>
  );
};
export default ExploreScreen;
