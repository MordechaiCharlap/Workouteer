import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import WorkoutType from "../components/WorkoutType";
import WorkoutMinutes from "../components/WorkoutMinutes";
import WorkoutStartingTime from "../components/WorkoutStartingTime";
import Geocoder from "react-native-geocoding";
import WorkoutDescription from "../components/WorkoutDescription";
import React, { useState, useEffect, useLayoutEffect } from "react";
import * as appStyle from "../components/AppStyleSheet";
import responsiveStyle from "../components/ResponsiveStyling";
import { useNavigation } from "@react-navigation/native";
import WorkoutLocation from "../components/WorkoutLocation";
import Header from "../components/Header";
import * as firebase from "../services/firebase";
import useAuth from "../hooks/useAuth";
import WorkoutSex from "../components/WorkoutSex";
import languageService from "../services/languageService";
const NewWorkoutScreen = () => {
  const navigation = useNavigation();

  const { user, setUser } = useAuth();
  const now = new Date();
  const [type, setType] = useState(null);
  const [startingTime, setStartingTime] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [workoutSex, setWorkoutSex] = useState("everyone");
  const [location, setLocation] = useState(null);
  const [description, setDescription] = useState("");
  const [isCreateDisabled, setIsCreateDisabled] = useState(true);
  const [createButtonTextColor, setCreateButtonTextColor] = useState("white");
  const [createButtonColor, setCreateButtonColor] = useState(
    appStyle.color_bg_variant
  );
  const [closestWorkoutDate, setClosestWorkoutDate] = useState(null);
  useEffect(() => {
    checkIfCanAddWorkout();
  }, [type, startingTime, minutes, location]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const checkIfCanAddWorkout = () => {
    if (
      type != null &&
      startingTime != null &&
      minutes != null &&
      location != null
    ) {
      setIsCreateDisabled(false);
      setCreateButtonTextColor(appStyle.color_on_primary);
      setCreateButtonColor(appStyle.color_primary);
    } else {
      setIsCreateDisabled(true);
      setCreateButtonTextColor("white");
      setCreateButtonColor("black");
    }
  };
  const getCityAndCountry = async (location) => {
    const arr = { city: "", country: "" };
    const json = await Geocoder.from(location);
    var results = json.results[0];
    for (var element of results.address_components) {
      if (element.types.includes("locality")) {
        arr.city = element.long_name;
      }
      if (element.types.includes("country")) {
        arr.country = element.long_name;
      }
    }
    return arr;
  };
  const createWorkout = async () => {
    navigation.goBack();
    setIsCreateDisabled(true);
    const cityAndCountry = await getCityAndCountry(location);
    const workout = {
      creator: user.id,
      members: { [user.id]: user.img },
      type: type,
      sex: workoutSex,
      startingTime: startingTime,
      minutes: minutes,
      location: location,
      description: description,
      ...cityAndCountry,
      invites: {},
      requests: {},
    };
    await firebase.createWorkout(workout);
  };
  return (
    <View style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <Header title="New workout" goBackOption={true} />
      <View className="flex-1 px-2">
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="pb-2 rounded">
            {/* margin is inside the component after each types row */}
            <WorkoutType typeSelected={setType} />
          </View>
          <View className="pb-2 rounded mb-5 flex-row justify-between">
            <WorkoutStartingTime
              setClosestWorkoutDate={setClosestWorkoutDate}
              startingTimeChanged={setStartingTime}
              minDate={now}
            />
            <WorkoutSex
              user={user}
              sexChanged={setWorkoutSex}
              text={"Open for both genders"}
            />
          </View>
          {startingTime != null && (
            <View className="pb-2 rounded mb-5">
              <WorkoutMinutes
                minutesSelected={setMinutes}
                workoutDate={startingTime}
                closestWorkoutDate={closestWorkoutDate}
              />
            </View>
          )}

          <View className="pb-2 rounded mb-5">
            <WorkoutDescription descChanged={setDescription} />
          </View>
          <View className="pb-2 rounded mb-5">
            <WorkoutLocation locationChanged={setLocation} />
          </View>
          <View className="items-center mb-5">
            <TouchableOpacity
              style={{
                backgroundColor: createButtonColor,
              }}
              disabled={isCreateDisabled}
              className="rounded-lg shadow px-7 py-1"
              onPress={createWorkout}
            >
              <Text
                style={{ color: createButtonTextColor }}
                className="text-center text-2xl font-semibold"
              >
                {languageService[user.language].createWorkout}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default NewWorkoutScreen;
