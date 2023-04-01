import {
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
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
import * as geoService from "../services/geoService";
import languageService from "../services/languageService";
import useNavbarDisplay from "../hooks/useNavbarDisplay";

const FindWorkoutScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();

  const navigation = useNavigation();

  const { user } = useAuth();

  const now = new Date();

  const [country, setCountry] = useState(user.defaultCountry);
  const [city, setCity] = useState(user.defaultCity);
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
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("FindWorkout");
      setType(0);
      setCity(user.defaultCity);
      setCountry(user.defaultCountry);
      setMinStartingTime(null);
      setMaxStartingTime(null);
    }, [])
  );
  useEffect(() => {
    const updateCountries = async () => {
      setCountriesArr(await firebase.getCountries());
    };
    updateCountries();
  }, []);
  useEffect(() => {
    if (country != null) {
      const updateCities = async () => {
        setCitiesArr(await firebase.getCities(country));
      };
      updateCities();
    }
  }, [country]);
  useEffect(() => {
    if (
      type == null ||
      minStartingTime == null ||
      maxStartingTime == null ||
      city == null ||
      country == null
    ) {
      setIsSearchDisabled(true);
    } else {
      setIsSearchDisabled(false);
    }
  }, [type, minStartingTime, maxStartingTime, city, country]);
  const getCurrentLocation = async () => {
    const currentLocation = await geoService.getCurrentLocation();
    setCurrentLocation(currentLocation);
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
    var updatedUser = user;
    if (!updatedUser.defaultCountry || updatedUser.defaultCountry != country)
      updatedUser.defaultCountry = country;
    if (!updatedUser.defaultCountry || updatedUser.defaultCountry != city)
      updatedUser.defaultCity = city;
    await firebase.updateUser(updatedUser);
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
    <View style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <Header
        title={languageService[user.language].findWorkout}
        goBackOption={true}
      />
      <View className="flex-1 px-2">
        <ScrollView>
          <WorkoutType
            language={user.language}
            typeSelected={setType}
            everythingOption={true}
          />
          <Dropdown
            style={[
              style.dropdown,
              countryIsFocus && { borderColor: appStyle.color_primary },
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
              cityIsFocus && { borderColor: appStyle.color_primary },
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
          <View
            className={`flex-row${user.language == "hebrew" ? "-reverse" : ""}`}
          >
            <TouchableOpacity
              onPress={() => setNoCityInformation(!noCityInformation)}
              className={`p-1 rounded ${noCityInformation ? "" : "mb-5"}`}
              style={{ backgroundColor: appStyle.color_primary }}
            >
              <Text style={{ color: appStyle.color_on_primary }}>
                {languageService[user.language].cantFindCityClickHere}
              </Text>
            </TouchableOpacity>
          </View>
          <Text
            className="mb-5 rounded p-1 mt-1"
            style={{
              color: appStyle.color_on_primary,
              backgroundColor: appStyle.color_bg_variant,
              display: noCityInformation ? "flex" : "none",
            }}
          >
            {languageService[user.language].cantFindCityExplenation}
          </Text>

          <View className="flex-row justify-around mb-5">
            <StartingTimeComp
              minDate={now}
              title={languageService[user.language].from}
              startingTimeChanged={(date) => minDateChanged(date)}
            />
            {minStartingTime != null && (
              <StartingTimeComp
                minDate={minStartingTime}
                title={languageService[user.language].to}
                startingTimeChanged={(date) => maxDateChanged(date)}
              />
            )}
          </View>
          <View className="mb-5">
            <View
              className={`flex-row${
                user.language == "hebrew" ? "-reverse" : ""
              }`}
            >
              <CheckBox
                backgroundColor={appStyle.color_primary}
                value={false}
                valueColor={appStyle.color_on_primary}
                onValueChange={(value) =>
                  value == true
                    ? user.isMale
                      ? setWorkoutSex("men")
                      : setWorkoutSex("women")
                    : setWorkoutSex("everyone")
                }
              />
              <View className="w-2" />
              <Text style={{ color: appStyle.color_primary }}>
                {user.isMale
                  ? languageService[user.language].showMenOnlyWorkouts
                  : languageService[user.language].showWomenOnlyWorkouts}
              </Text>
            </View>
          </View>
          <View className="mb-5">
            <View
              className={`flex-row${
                user.language == "hebrew" ? "-reverse" : ""
              }`}
            >
              <CheckBox
                backgroundColor={appStyle.color_primary}
                value={false}
                valueColor={appStyle.color_on_primary}
                onValueChange={(value) =>
                  value == true
                    ? getCurrentLocation()
                    : setCurrentLocation(null)
                }
              />
              <View className="w-2" />
              <Text style={{ color: appStyle.color_primary }}>
                {
                  languageService[user.language]
                    .useLocationToMessureDistanceFromWorkout
                }
              </Text>
            </View>
          </View>
          <View className="items-center">
            <TouchableOpacity
              disabled={isSearchDisabled}
              className="px-2 py-1 mb-5"
              onPress={showResults}
              style={{
                backgroundColor: isSearchDisabled
                  ? appStyle.color_bg_variant
                  : appStyle.color_primary,
              }}
            >
              <Text
                className="text-2xl"
                style={{
                  color: isSearchDisabled
                    ? appStyle.color_primary
                    : appStyle.color_on_primary,
                }}
              >
                {languageService[user.language].search}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};
const StartingTimeComp = (props) => {
  return (
    <View
      className="rounded-xl p-2 pb-4 px-4 items-center"
      style={{ backgroundColor: appStyle.color_bg }}
    >
      <Text
        className="text-xl font-semibold"
        style={{ color: appStyle.color_primary }}
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
    color: appStyle.color_on_primary,
  },
  text: { color: appStyle.color_on_primary },
  container: {
    paddingHorizontal: 16,
  },
  dropdown: {
    backgroundColor: appStyle.color_primary,
    height: 50,
    borderColor: appStyle.color_on_primary,
    borderWidth: 0.5,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
    color: "white",
  },
  placeholderStyle: {
    color: "#5f6b8b",
    fontSize: 16,
  },
  selectedTextStyle: {
    color: appStyle.color_on_primary,
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
