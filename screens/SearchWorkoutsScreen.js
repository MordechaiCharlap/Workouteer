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
const SearchWorkoutsScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();

  const navigation = useNavigation();

  const { user } = useAuth();

  const pages = ["Workout Type", "Where"];
  const { width, height } = useWindowDimensions();
  const fixedHeight = height;
  const fixedWidth = isWebOnPC ? (9 / 19) * fixedHeight : width;
  const scrollViewRef = useRef(null);
  const currentPageIndexRef = useRef(0);
  const handleNextPage = () => {
    if (pages.length == currentPageIndexRef.current + 1) return;
    currentPageIndexRef.current++;
    checkIfLastPage();
    scroll();
  };
  const handlePrevPage = () => {
    if (currentPageIndexRef.current == 0) return;
    currentPageIndexRef.current--;

    checkIfLastPage();
    scroll();
  };

  const handleScrollEnd = (event) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / fixedWidth);
    currentPageIndexRef.current = index;
    checkIfLastPage();
  };

  const scroll = () => {
    scrollViewRef.current.scrollTo({
      animated: true,
      x: currentPageIndexRef.current * width,
      y: 0,
    });
  };
  const checkIfLastPage = () => {
    if (currentPageIndexRef.current + 1 == pages.length) {
      setLastPage(true);
    } else setLastPage(false);
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
  const [lastPage, setLastPage] = useState(false);
  const [country, setCountry] = useState(user.defaultCountry);
  const [city, setCity] = useState(user.defaultCity);
  const [type, setType] = useState(0);
  const [workoutSex, setWorkoutSex] = useState("everyone");
  const [countryIsFocus, setCountryIsFocus] = useState(false);
  const [cityIsFocus, setCityIsFocus] = useState(false);
  const [countriesArr, setCountriesArr] = useState([]);
  const [citiesArr, setCitiesArr] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isSearchDisabled, setIsSearchDisabled] = useState(true);
  const [searching, setSearching] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("FindWorkout");
      setType(0);
      setCity(user.defaultCity);
      setCountry(user.defaultCountry);
      setSearching(false);
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
    if (city == null || country == null) {
      setIsSearchDisabled(true);
    } else {
      setIsSearchDisabled(false);
    }
  }, [city, country]);
  const getCurrentLocation = async () => {
    const currentLocation = await geoService.getCurrentLocation(user);
    setCurrentLocation(currentLocation);
  };
  const handleSearch = async () => {
    if (searching) return;
    setSearching(true);
    var updatedUser = user;
    if (
      !updatedUser.defaultCountry != country ||
      updatedUser.defaultCity != city
    ) {
      updatedUser.defaultCountry = country;
      updatedUser.defaultCity = city;
      await firebase.updateUser(updatedUser);
    }
    const preferences = {
      country: country,
      city: city,
      type: type,
      minTime: now,
      sex: workoutSex,
    };
    // const workouts = await firebase.getWorkoutResults(preferences);
    const workouts = await firebase.searchWorkouts(preferences, user.id);
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
      <ScrollView
        showsHorizontalScrollIndicator={Platform.OS == "web" ? false : true}
        horizontal={true}
        ref={scrollViewRef}
        pagingEnabled={true}
        onMomentumScrollEnd={handleScrollEnd}
      >
        <View title={"Workout type"} style={style.slideStyle}>
          <WorkoutType
            language={user.language}
            typeSelected={setType}
            everythingOption={true}
          />
        </View>
        <View style={style.slideStyle}>
          <View className="mt-5">
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
          </View>
          <View className="mt-5">
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
          </View>

          <View className="mt-5">
            <View
              className={`items-center flex-row${
                user.language == "hebrew" ? "-reverse" : ""
              }`}
            >
              <CheckBox
                size={40}
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
        {lastPage ? (
          <TouchableOpacity
            onPress={handleSearch}
            className="w-1 rounded grow items-center justify-center py-3"
            style={{
              backgroundColor: appStyle.color_primary_variant,
              borderWidth: 1,
              borderColor: convertHexToRgba(appStyle.color_on_primary, 0.6),
            }}
          >
            <Text
              className="font-black"
              style={{ color: appStyle.color_on_primary }}
            >
              {searching
                ? languageService[user.language].searching.toUpperCase()
                : languageService[user.language].search.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled={isSearchDisabled}
            onPress={handleNextPage}
            className="w-1 rounded grow items-center justify-center py-3"
            style={{ backgroundColor: appStyle.color_primary }}
          >
            <Text
              className="font-black"
              style={{ color: appStyle.color_on_primary }}
            >
              {languageService[user.language].continue[
                user.isMale ? 1 : 0
              ].toUpperCase()}
            </Text>
          </TouchableOpacity>
        )}
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
