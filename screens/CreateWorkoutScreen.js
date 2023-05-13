import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  useWindowDimensions,
} from "react-native";
import WorkoutType from "../components/WorkoutType";
import WorkoutMinutes from "../components/WorkoutMinutes";
import WorkoutStartingTime from "../components/WorkoutStartingTime";
import Geocoder from "react-native-geocoding";
import WorkoutDescription from "../components/WorkoutDescription";
import React, { useState, useEffect, useCallback } from "react";
import * as appStyle from "../utilities/appStyleSheet";
import { safeAreaStyle } from "../components/safeAreaStyle";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import WorkoutLocation from "../components/WorkoutLocation";
import Header from "../components/Header";
import * as firebase from "../services/firebase";
import useAuth from "../hooks/useAuth";
import WorkoutSex from "../components/WorkoutSex";
import languageService from "../services/languageService";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import usePushNotifications from "../hooks/usePushNotifications";
import NextWeekDropdown from "../components/NextWeekDropdown";
import * as workoutUtils from "../utilities/workoutUtils";
import AwesomeAlert from "react-native-awesome-alerts";
import { convertHexToRgba } from "../utilities/stylingFunctions";
import { isWebOnPC } from "../services/webScreenService";
import { useRef } from "react";
const CreateWorkoutScreen = () => {
  const navigation = useNavigation();
  const { setCurrentScreen } = useNavbarDisplay();
  const { user } = useAuth();
  const {
    schedulePushNotification,
    sendPushNotificationForFriendsAboutWorkout,
  } = usePushNotifications();
  const now = new Date();
  const [type, setType] = useState(null);
  const [startingTime, setStartingTime] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [workoutSex, setWorkoutSex] = useState("everyone");
  const [location, setLocation] = useState(null);
  const [description, setDescription] = useState("");
  const [isCreateDisabled, setIsCreateDisabled] = useState(true);
  const [continueDisabled, setContinueDisabled] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const pages = ["Workout Type", "Create Workout"];
  const [pageIndex, setPageIndex] = useState(0);
  const { width, height } = useWindowDimensions();
  const fixedHeight = height;
  const fixedWidth = isWebOnPC ? (9 / 19) * fixedHeight : width;
  const scrollViewRef = useRef(null);
  const currentPageIndexRef = useRef(0);
  const handleNextPage = () => {
    if (pages.length == currentPageIndexRef.current + 1) return;
    setPageIndex(currentPageIndexRef.current + 1);
    currentPageIndexRef.current++;
    scroll();
  };
  const handlePrevPage = () => {
    if (currentPageIndexRef.current == 0) return;
    setPageIndex(currentPageIndexRef.current - 1);
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
      x: currentPageIndexRef.current * width,
      y: 0,
    });
  };
  useEffect(() => {
    console.log(pageIndex);
    switch (pageIndex) {
      case 0:
        if (type == null) {
          setContinueDisabled(true);
          return;
        }
      case 1:
        if (type == null) {
          setContinueDisabled(true);
          return;
        }
    }
    setContinueDisabled(false);
  }, [pageIndex, type]);
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
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("CreateWorkout");
    }, [])
  );
  const checkIfWorkoutTimeAvailable = () => {
    const closestWorkout =
      workoutUtils.checkIfDateAvailableAndReturnClosestWorkout(
        user,
        startingTime
      );
    if (closestWorkout == false) {
      setAlertTitle(
        languageService[user.language].alreadyScheduledAWorkoutThisDate
      );
      setAlertMessage(
        languageService[user.language].chooseAnotherDate[user.isMale ? 1 : 0]
      );
      return false;
    } else {
      if (
        closestWorkout != null &&
        new Date(startingTime.getTime() + minutes * 60000) > closestWorkout
      ) {
        setAlertTitle(
          languageService[user.language].yourWorkoutOverlappingOtherWorkout
        );
        setAlertMessage(
          languageService[user.language].tryToScheduleAnEearlierWorkout
        );
        return false;
      }
    }
    return true;
  };
  useEffect(() => {
    checkIfCanAddWorkout();
  }, [type, startingTime, minutes, location]);
  const checkIfCanAddWorkout = () => {
    if (
      type != null &&
      startingTime != null &&
      minutes != null &&
      location != null
    ) {
      setIsCreateDisabled(false);
    } else {
      setIsCreateDisabled(true);
    }
  };
  const createWorkout = async () => {
    if (checkIfWorkoutTimeAvailable()) {
      setIsCreateDisabled(true);
      navigation.goBack();
      var scheduledNotificationId;
      if (Platform.OS != "web") {
        scheduledNotificationId = await schedulePushNotification(
          startingTime,
          "Workout session started!",
          "Don't forget to confirm your workout to get your points :)"
        );
      }
      const workout = {
        creator: user.id,
        members: {
          [user.id]: {
            notificationId: scheduledNotificationId
              ? scheduledNotificationId
              : null,
            confirmedWorkout: false,
          },
        },
        type: type,
        sex: workoutSex,
        startingTime: startingTime,
        minutes: minutes,
        location: location,
        description: description,
        invites: {},
        requests: {},
      };
      await firebase.createWorkout(workout);
      await sendPushNotificationForFriendsAboutWorkout(workoutSex, type);
    } else {
      setShowAlert(true);
    }
  };
  return (
    <View style={safeAreaStyle()}>
      <Header
        title={languageService[user.language].createWorkout}
        goBackOption={true}
      />
      <ScrollView
        showsHorizontalScrollIndicator={Platform.OS == "web" ? false : true}
        horizontal={true}
        ref={scrollViewRef}
        pagingEnabled={true}
        scrollEnabled={false}
        onMomentumScrollEnd={handleScrollEnd}
      >
        <View title={"Workout type"} style={style.slideStyle}>
          <WorkoutType
            language={user.language}
            typeSelected={(type) => {
              setType(type);
              handleNextPage();
            }}
          />
        </View>
        <View title={"Workout Date"} style={style.slideStyle}>
          <NextWeekDropdown
            language={user.language}
            now={now}
            selectedDateChanged={setStartingTime}
          />
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
        {pageIndex == pages.length - 1 ? (
          <TouchableOpacity
            disabled={isCreateDisabled}
            onPress={createWorkout}
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
              {loading
                ? languageService[user.language].loading.toUpperCase()
                : languageService[user.language].createWorkout.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            disabled={continueDisabled}
            onPress={handleNextPage}
            className="w-1 rounded grow items-center justify-center py-3"
            style={{
              backgroundColor: continueDisabled
                ? appStyle.color_bg_variant
                : appStyle.color_primary,
            }}
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

export default CreateWorkoutScreen;
