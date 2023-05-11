import { View, Text } from "react-native";
import { safeAreaStyle } from "../components/safeAreaStyle";
import Header from "../components/Header";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import languageService from "../services/languageService";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import useFriendsWorkouts from "../hooks/useFriendsWorkouts";
import { FlatList } from "react-native";
import WorkoutComponent from "../components/WorkoutComponent";
import AwesomeModal from "../components/AwesomeModal";
import * as geoService from "../services/geoService";
import { color_on_primary, color_primary } from "../utilities/appStyleSheet";
const FriendsWorkoutsScreen = () => {
  const { friendsWorkouts } = useFriendsWorkouts();
  const { user } = useAuth();
  const { setCurrentScreen } = useNavbarDisplay();
  const [currentLocation, setCurrentLocation] = useState();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("FriendsWorkouts");
    }, [])
  );
  useEffect(() => {
    const getCurrentLocation = async () => {
      const location = await geoService.getCurrentLocation();
      setCurrentLocation(location);
    };
    getCurrentLocation();
  }, []);
  useEffect(() => {
    console.log(currentLocation);
  }, [currentLocation]);
  return (
    <View style={safeAreaStyle()}>
      <Header
        title={languageService[user.language].friendsWorkouts}
        goBackOption={true}
      />
      <View className="flex-1 px-4">
        {currentLocation != null ? (
          <FlatList
            className="p-2"
            showsVerticalScrollIndicator={false}
            data={friendsWorkouts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <WorkoutComponent
                location={currentLocation}
                workout={item}
                isPastWorkout={false}
                screen={"FriendsWorkouts"}
              />
            )}
          />
        ) : (
          <View className="flex-1 items-center">
            <Text
              style={{
                color: color_on_primary,
                backgroundColor: color_primary,
              }}
              className="text-2xl px-3 py-2 rounded mt-40"
            >
              {languageService[user.language].gettingCurrentLocation}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default FriendsWorkoutsScreen;
