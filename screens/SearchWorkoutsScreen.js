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
import BackOrExitButton from "../components/slides/BackOrExitButton";
import { Title } from "../components/slides/Title";
import CustomButton from "../components/basic/CustomButton";
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
  const [pageIndex, setPageIndex] = useState(0);
  const handleNextPage = () => {
    if (pages.length == currentPageIndexRef.current + 1) return;
    currentPageIndexRef.current++;
    setPageIndex((prev) => prev + 1);

    scroll();
  };
  const handlePrevPage = () => {
    if (currentPageIndexRef.current == 0) {
      navigation.goBack();
      return;
    }
    setPageIndex((prev) => prev - 1);
    currentPageIndexRef.current--;

    scroll();
  };

  const handleScrollEnd = (event) => {
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.round(offset / fixedWidth);
    currentPageIndexRef.current = index;
    setPageIndex(index);
  };
  const scroll = () => {
    scrollViewRef.current.scrollTo({
      animated: true,
      x: currentPageIndexRef.current * fixedWidth,
      y: 0,
    });
  };
  const style = StyleSheet.create({
    slideStyle: {
      rowGap: 15,
      paddingTop: 20,
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
      backgroundColor: appStyle.color_on_background,
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
      setCurrentScreen("SearchWorkouts");
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
    if (pageIndex == 1) setCity();
  }, [citiesArr]);
  useEffect(() => {
    if (city == null) {
      setIsSearchDisabled(true);
    } else {
      setIsSearchDisabled(false);
    }
  }, [city]);
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
    navigation.replace("SearchedWorkouts", {
      workouts: workouts,
      user: user,
      location: currentLocation,
    });
  };
  const backOrExitButtonStyle = {
    color: appStyle.color_on_background,
    size: 25,
  };

  return (
    <View style={safeAreaStyle()}>
      <BackOrExitButton
        style={backOrExitButtonStyle}
        firstPage={pageIndex == 0}
        handlePrevPage={handlePrevPage}
      />
      <ScrollView
        showsHorizontalScrollIndicator={Platform.OS == "web" ? false : true}
        horizontal={true}
        ref={scrollViewRef}
        pagingEnabled={true}
        onMomentumScrollEnd={handleScrollEnd}
      >
        <View style={style.slideStyle}>
          <Title
            title={
              languageService[user.language].whatAreYouLookingFor[
                user.isMale ? 1 : 0
              ]
            }
          />
          <WorkoutType
            language={user.language}
            typeSelected={setType}
            everythingOption={true}
          />
        </View>
        <View style={style.slideStyle}>
          <Title title={languageService[user.language].where} />
          <Dropdown
            style={[style.dropdown]}
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
          <View className="mt-5">
            <Dropdown
              style={[style.dropdown]}
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
                backgroundColor={appStyle.color_on_background}
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
              <Text style={{ color: appStyle.color_on_background }}>
                {user.isMale
                  ? languageService[user.language].showMenOnlyWorkouts
                  : languageService[user.language].showWomenOnlyWorkouts}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {pageIndex == pages.length - 1 ? (
        <CustomButton
          disabled={isSearchDisabled}
          onPress={handleSearch}
          round
          style={{
            padding: 16,
            margin: 16,
            backgroundColor: appStyle.color_on_background,
          }}
        >
          <Text
            className="font-black text-lg"
            style={{ color: appStyle.color_background }}
          >
            {searching
              ? languageService[user.language].searching.toUpperCase()
              : languageService[user.language].search.toUpperCase()}
          </Text>
        </CustomButton>
      ) : (
        <CustomButton
          onPress={handleNextPage}
          round
          style={{
            padding: 16,
            margin: 16,
            backgroundColor: appStyle.color_on_background,
          }}
        >
          <Text
            className="font-black text-lg"
            style={{
              color: appStyle.color_background,
            }}
          >
            {languageService[user.language].continue[
              user.isMale ? 1 : 0
            ].toUpperCase()}
          </Text>
        </CustomButton>
      )}
    </View>
  );
};
export default SearchWorkoutsScreen;
