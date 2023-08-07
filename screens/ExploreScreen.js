import { View, Text } from "react-native";
import { React, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { safeAreaStyle } from "../components/safeAreaStyle";
import useAuth from "../hooks/useAuth";
import useNavbarNavigation from "../hooks/useNavbarNavigation";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import LatestWorkouts from "../components/exploreScreen/LatestWorkouts";
import {
  color_on_surface_variant,
  color_surface_variant,
} from "../utils/appStyleSheet";
import languageService from "../services/languageService";
import Header from "../components/Header";
import useExplore from "../hooks/useExplore";
import SuggestedUsers from "../components/exploreScreen/SuggestedUsers";

const ExploreScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  const { setScreen } = useNavbarNavigation();
  const { suggestedUsers, getSuggestedUsers } = useExplore();
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
  useFocusEffect(
    useCallback(() => {
      getSuggestedUsers();
    }, [])
  );
  return (
    <View style={[safeAreaStyle()]}>
      {/* <SearchUsers language={user.language} setIsEmpty={setSearchInputEmpty} /> */}
      <Header title={languageService[user.language].explore} />
      {suggestedUsers != null && suggestedUsers.length > 0 && (
        <SuggestedUsers
          onContainerColor={onContainerColor}
          containerColor={containerColor}
        />
      )}
      {searchInputEmpty == true && (
        <LatestWorkouts
          onContainerColor={onContainerColor}
          containerColor={containerColor}
        />
      )}
    </View>
  );
};
export default ExploreScreen;
