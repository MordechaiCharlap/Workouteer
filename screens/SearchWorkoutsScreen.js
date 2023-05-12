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
import React, { useCallback, useRef, useState } from "react";
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
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChevronCircleLeft,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
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
  const handleNextPage = () => {
    currentPageIndexRef.current++;
    scrollViewRef.current.scrollTo({
      animated: true,
      x: currentPageIndexRef.current * fixedWidth,
      y: 0,
    });
  };
  const handlePrevPage = () => {
    currentPageIndexRef.current--;
    scrollViewRef.current.scrollTo({
      animated: true,
      x: currentPageIndexRef.current * fixedWidth,
      y: 0,
    });
  };
  const style = StyleSheet.create({
    slideStyle: {
      width: fixedWidth,
      justifyContent: "center",
      alignItems: "center",
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
      <ScrollView horizontal={true} ref={scrollViewRef} pagingEnabled={true}>
        <View style={style.slideStyle}>
          <Text>1</Text>
        </View>
        <View style={style.slideStyle}>
          <Text>2</Text>
        </View>
        <View style={style.slideStyle}>
          <Text>3</Text>
        </View>
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          paddingVertical: 10,
        }}
      >
        <TouchableOpacity onPress={handlePrevPage}>
          <FontAwesomeIcon
            icon={faChevronCircleLeft}
            color={appStyle.color_primary}
            size={50}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextPage}>
          <FontAwesomeIcon
            icon={faChevronCircleRight}
            color={appStyle.color_primary}
            size={50}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchWorkoutsScreen;
