import {
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  useWindowDimensions,
} from "react-native";
import React, { useCallback, useRef, useState, Children } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { safeAreaStyle } from "../components/safeAreaStyle";
import Header from "../components/Header";
import WorkoutType from "../components/WorkoutType";
import WorkoutStartingTime from "../components/WorkoutStartingTime";
import { useEffect } from "react";
import * as appStyle from "../utilities/appStyleSheet";
import * as firebase from "../services/firebase";
import useAuth from "../hooks/useAuth";
import CheckBox from "../components/CheckBox";
import { Dropdown } from "react-native-element-dropdown";
import * as geoService from "../services/geoService";
import languageService from "../services/languageService";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import NextWeekDropdown from "../components/NextWeekDropdown";
import { isWebOnPC } from "../services/webScreenService";
import { convertHexToRgba } from "../utilities/stylingFunctions";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChevronCircleLeft,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import AnimatedSlides from "../components/basic/AnimatedSlides";
const SearchWorkoutsScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();

  const navigation = useNavigation();

  const { user } = useAuth();

  const { width, height } = useWindowDimensions();
  const fixedHeight = height;
  const fixedWidth = isWebOnPC ? (9 / 19) * fixedHeight : width;
  const [country, setCountry] = useState(user.defaultCountry);
  const scrollViewRef = useRef(null);
  const currentPageIndexRef = useRef(0);
  const pagesCount = 3;
  const handleNextPage = () => {
    if (pagesCount == currentPageIndexRef.current + 1) return;
    currentPageIndexRef.current++;
    scroll();
  };
  const handlePrevPage = () => {
    if (currentPageIndexRef.current == 0) return;
    currentPageIndexRef.current--;

    scroll();
  };
  const scroll = () => {
    scrollViewRef.current.scrollTo({
      animated: true,
      x: currentPageIndexRef.current * width,
      y: 0,
    });
  };
  const style = StyleSheet.create({
    slideStyle: {
      paddingHorizontal: 10,
      width: fixedWidth,
    },
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
      textAlign: "center",
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

  const now = new Date();

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
  const steps = ["Workout Type", "City", "When"];
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
        setCitiesArr(await firebase.getCities(country, user.language));
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
    const currentLocation = await geoService.getCurrentLocation(user);
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
  const renderMinStartingTime = () => {
    return (
      <StartingTimeComp
        language={user.language}
        now={now}
        title={languageService[user.language].from}
        startingTimeChanged={(date) => minDateChanged(date)}
      />
    );
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
    <View style={safeAreaStyle()}>
      <Header
        title={languageService[user.language].findWorkout}
        goBackOption={true}
      />
      <View className="flex-row"></View>
      <ScrollView horizontal={true} ref={scrollViewRef} pagingEnabled={true}>
        <View title={"Workout type"} style={style.slideStyle}>
          <WorkoutType
            language={user.language}
            typeSelected={setType}
            everythingOption={true}
          />
        </View>
        <View style={style.slideStyle}>
          <Dropdown
            style={[
              style.dropdown,
              countryIsFocus && { borderColor: appStyle.color_primary },
            ]}
            placeholder={languageService[user.language].country}
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
            placeholder={languageService[user.language].city}
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
          {/* <View
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
              backgroundColor: appStyle.color_primary_variant,
              display: noCityInformation ? "flex" : "none",
            }}
          >
            {languageService[user.language].cantFindCityExplenation}
          </Text> */}
        </View>
        <View style={style.slideStyle}>
          <View
            className={`justify-around mb-5 ${
              Platform.OS == "web"
                ? ""
                : `flex-row${user.language == "hebrew" ? "-reverse" : ""}`
            }`}
          >
            <StartingTimeComp
              language={user.language}
              now={now}
              title={languageService[user.language].from}
              startingTimeChanged={(date) => minDateChanged(date)}
            />
            {minStartingTime != null && (
              <StartingTimeComp
                now={now}
                language={user.language}
                minDate={minStartingTime}
                title={languageService[user.language].to}
                startingTimeChanged={(date) => maxDateChanged(date)}
                setLast={true}
              />
            )}
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          padding: 10,
          columnGap: 10,
        }}
      >
        <TouchableOpacity
          onPress={handlePrevPage}
          className="w-1 rounded grow items-center justify-center py-3"
          style={{
            borderWidth: 2,
            borderColor: convertHexToRgba(appStyle.color_primary, 0.15),
          }}
        >
          <Text
            className="font-black"
            style={{ color: appStyle.color_primary }}
          >
            {languageService[user.language].back.toUpperCase()}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNextPage}
          className="w-1 rounded grow items-center justify-center py-3"
          style={{ backgroundColor: appStyle.color_primary }}
        >
          <Text className="font-black" style={{ color: appStyle.color_bg }}>
            {languageService[user.language].continue[
              user.isMale ? 1 : 0
            ].toUpperCase()}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const StartingTimeComp = (props) => {
  return Platform.OS == "web" ? (
    <View className="rounded-xl" style={{ backgroundColor: appStyle.color_bg }}>
      <Text
        className="text-xl font-semibold text-center"
        style={{ color: appStyle.color_primary }}
      >
        {props.title}
      </Text>
      <NextWeekDropdown
        setLast={props.setLast}
        language={props.language}
        now={props.now}
        minDate={props.minDate}
        selectedDateChanged={props.startingTimeChanged}
      ></NextWeekDropdown>
    </View>
  ) : (
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
        minDate={props.minDate ? props.minDate : new Date()}
      />
    </View>
  );
};
export default SearchWorkoutsScreen;
