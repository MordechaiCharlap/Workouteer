import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import responsiveStyle from "../components/ResponsiveStyling";
import Header from "../components/Header";
import WorkoutType from "../components/WorkoutType";
import WorkoutStartingTime from "../components/WorkoutStartingTime";
import { useEffect } from "react";
import * as appStyle from "../components/AppStyleSheet";
import * as firebase from "../services/firebase";
import useAuth from "../hooks/useAuth";
import CheckBox from "../components/CheckBox";
import { Dropdown } from "react-native-element-dropdown";
import * as Location from "expo-location";
const FindWorkoutScreen = () => {
  const now = new Date();
  const { user } = useAuth();
  const navigation = useNavigation();
  const [country, setCountry] = useState(user.country);
  const [city, setCity] = useState(null);
  const [type, setType] = useState(0);
  const [isSearchDisabled, setIsSearchDisabled] = useState(true);
  const [minStartingTime, setMinStartingTime] = useState(null);
  const [maxStartingTime, setMaxStartingTime] = useState(null);
  const [workoutSex, setWorkoutSex] = useState("everyone");
  const [countryIsFocus, setCountryIsFocus] = useState(false);
  const [cityIsFocus, setCityIsFocus] = useState(false);
  const [noCityInformation, setNoCityInformation] = useState(false);
  const [countriesArr, setCountriesArr] = useState([]);
  const [citiesArr, setCitiesArr] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  useEffect(() => {
    const updateCountries = async () => {
      setCountriesArr(await firebase.getCountries());
    };
    updateCountries();
  }, []);
  useEffect(() => {
    const updateCities = async () => {
      setCitiesArr(await firebase.getCities(country));
    };
    updateCities();
  }, [country]);
  useEffect(() => {
    if (
      type == null ||
      minStartingTime == null ||
      maxStartingTime == null ||
      city == null
    ) {
      setIsSearchDisabled(true);
      console.log("cant search");
    } else {
      setIsSearchDisabled(false);

      console.log("can search");
    }
  }, [type, minStartingTime, maxStartingTime, city, country]);
  const getCurrentLocation = async () => {
    const location = await Location.getCurrentPositionAsync({});
    const latLongLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    setCurrentLocation(latLongLocation);
  };
  const minDateChanged = (date) => {
    setMinStartingTime(null);
    setMinStartingTime(date);
  };
  const maxDateChanged = (date) => {
    if (date < minStartingTime) {
      minDateChanged(minStartingTime);
      setMaxStartingTime(null);
    } else {
      setMaxStartingTime(date);
    }
  };
  const showResults = async () => {
    const preferences = {
      country: country,
      city: city,
      type: type,
      minTime: minStartingTime,
      maxTime: maxStartingTime,
      sex: workoutSex,
    };
    const workouts = await firebase.getWorkoutResults(preferences);
    navigation.navigate("SearchedWorkouts", {
      workouts: workouts,
      user: user,
      location: currentLocation,
    });
  };
  return (
    <SafeAreaView style={responsiveStyle.safeAreaStyle}>
      <Header title="Find workout" goBackOption={true} />
      <View className="flex-1 px-4">
        <ScrollView>
          <WorkoutType typeSelected={setType} everythingOption={true} />
          <Dropdown
            style={[
              style.dropdown,
              countryIsFocus && { borderColor: appStyle.appAzure },
            ]}
            placeholder="Country"
            placeholderStyle={style.placeholderStyle}
            selectedTextStyle={style.selectedTextStyle}
            inputSearchStyle={style.inputSearchStyle}
            iconStyle={style.iconStyle}
            data={countriesArr}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={country}
            onFocus={() => setCountryIsFocus(true)}
            onBlur={() => setCountryIsFocus(false)}
            onChange={(item) => {
              setCountry(item.value);
              setCountryIsFocus(false);
            }}
          />
          <Dropdown
            style={[
              style.dropdown,
              cityIsFocus && { borderColor: appStyle.appAzure },
            ]}
            placeholder="City"
            placeholderStyle={style.placeholderStyle}
            selectedTextStyle={style.selectedTextStyle}
            inputSearchStyle={style.inputSearchStyle}
            iconStyle={style.iconStyle}
            data={citiesArr}
            maxHeight={300}
            labelField="label"
            valueField="value"
            value={city}
            onFocus={() => setCityIsFocus(true)}
            onBlur={() => setCityIsFocus(false)}
            onChange={(item) => {
              setCity(item.value);
              setCityIsFocus(false);
            }}
          />
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => setNoCityInformation(!noCityInformation)}
              className={`p-1 rounded ${noCityInformation ? "" : "mb-5"}`}
              style={{ backgroundColor: appStyle.appLightBlue }}
            >
              <Text style={{ color: appStyle.appDarkBlue }}>
                Can't find a certain city? Click here
              </Text>
            </TouchableOpacity>
          </View>
          <Text
            className="mb-5"
            style={{
              color: appStyle.appLightBlue,
              display: noCityInformation ? "flex" : "none",
            }}
          >
            If The city you're looking for doesn't appear here, it's because no
            workout has been created there yet. Be the first!
          </Text>

          <View className="flex-row justify-around mb-5">
            <StartingTimeComp
              minDate={now}
              title="From"
              startingTimeChanged={(date) => minDateChanged(date)}
            />
            {minStartingTime != null && (
              <StartingTimeComp
                minDate={minStartingTime}
                title="to"
                startingTimeChanged={(date) => maxDateChanged(date)}
              />
            )}
          </View>
          <View className="mb-5">
            <View className="flex-row">
              <CheckBox
                backgroundColor={appStyle.appLightBlue}
                value={false}
                onValueChange={(value) =>
                  value == true
                    ? user.isMale
                      ? setWorkoutSex("men")
                      : setWorkoutSex("women")
                    : setWorkoutSex("everyone")
                }
              />
              <Text className="ml-2" style={{ color: appStyle.appLightBlue }}>
                Show me just {user.isMale ? "men" : "women"}-only workouts
              </Text>
            </View>
          </View>
          <View className="mb-5">
            <View className="flex-row">
              <CheckBox
                backgroundColor={appStyle.appLightBlue}
                value={false}
                onValueChange={(value) =>
                  value == true
                    ? getCurrentLocation()
                    : setCurrentLocation(null)
                }
              />
              <Text className="ml-2" style={{ color: appStyle.appLightBlue }}>
                Use my location to messure distance from workout
              </Text>
            </View>
          </View>
          <View className="items-center">
            <TouchableOpacity
              disabled={isSearchDisabled}
              className="px-2 py-1"
              onPress={showResults}
              style={{
                backgroundColor: isSearchDisabled
                  ? appStyle.appDarkBlueGrayer
                  : appStyle.appAzure,
              }}
            >
              <Text
                className="text-2xl"
                style={{ color: appStyle.appDarkBlue }}
              >
                Search
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
const StartingTimeComp = (props) => {
  return (
    <View
      className="rounded-xl p-2 pb-4 px-4 items-center"
      style={{ backgroundColor: appStyle.appLightBlue }}
    >
      <Text
        className="text-xl font-semibold"
        style={{ color: appStyle.appDarkBlue }}
      >
        {props.title}
      </Text>
      <WorkoutStartingTime
        startingTimeChanged={props.startingTimeChanged}
        minDate={props.minDate}
      />
    </View>
  );
};
export default FindWorkoutScreen;
const style = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#5f6b8b",
    color: appStyle.appGray,
  },
  text: { color: appStyle.appGray },
  container: {
    paddingHorizontal: 16,
  },
  dropdown: {
    backgroundColor: appStyle.appGray,
    height: 50,
    borderColor: "#5f6b8b",
    borderWidth: 0.5,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
    color: "white",
  },
  label: {
    position: "absolute",
    color: "#5f6b8b",
    backgroundColor: appStyle.appYellow,
    left: 22,
    top: -10,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    color: "#5f6b8b",
    fontSize: 16,
  },
  selectedTextStyle: {
    color: "#5f6b8b",
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
