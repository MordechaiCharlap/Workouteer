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
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft, faX } from "@fortawesome/free-solid-svg-icons";
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
  const [isCreateDisabled, setIsCreateDisabled] = useState(false);
  const [continueDisabled, setContinueDisabled] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const pages = [
    "Workout Type",
    "Date and Duration",
    "Location",
    "Sex and Description",
  ];
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
    if (currentPageIndexRef.current == 0) {
      navigation.goBack();
      return;
    }
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
    switch (pageIndex) {
      case 0:
        if (type == null) {
          setContinueDisabled(true);
          return;
        }
        break;
      case 1:
        if (minutes == null || startingTime == null) {
          setContinueDisabled(true);
          return;
        }
        break;
      case 2:
        if (location == null) {
          setContinueDisabled(true);
          return;
        }
        break;
    }
    setContinueDisabled(false);
  }, [pageIndex, type, minutes, startingTime, location]);
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

    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
  });
  const upperIconStyle = { color: appStyle.color_primary, size: 30 };
  const TitleAndBackOption = (props) => {
    return (
      <View>
        <TouchableOpacity onPress={handlePrevPage}>
          <FontAwesomeIcon
            icon={props.icon}
            size={upperIconStyle.size}
            color={upperIconStyle.color}
          />
        </TouchableOpacity>

        <Text
          className="text-center text-lg"
          style={{ color: appStyle.color_primary }}
        >
          {props.title}
        </Text>
      </View>
    );
  };
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
  const createWorkout = async () => {
    if (checkIfWorkoutTimeAvailable()) {
      setIsCreateDisabled(true);
      setLoading(true);
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
      const newWorkoutId = await firebase.createWorkout(workout);
      const returnedWorkout = await firebase.getWorkout(newWorkoutId);
      navigation.replace("WorkoutDetails", {
        workout: returnedWorkout,
        isCreator: true,
        isPastWorkout: false,
        userMemberStatus: "creator",
      });
      await sendPushNotificationForFriendsAboutWorkout(workoutSex, type);
    } else {
      setShowAlert(true);
    }
  };
  return (
    <View style={safeAreaStyle()}>
      <View className="flex-1">
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          ref={scrollViewRef}
          pagingEnabled={true}
          scrollEnabled={false}
          onMomentumScrollEnd={handleScrollEnd}
        >
          <View style={style.slideStyle}>
            <TitleAndBackOption title={"Workout Type"} icon={faX} />
            <WorkoutType
              language={user.language}
              typeSelected={(type) => {
                setType(type);
              }}
            />
          </View>

          <View title={"Date and Duration"} style={style.slideStyle}>
            <TitleAndBackOption
              title={"Date and Duration"}
              icon={faChevronLeft}
            />
            {Platform.OS == "web" ? (
              <View>
                <NextWeekDropdown
                  language={user.language}
                  now={now}
                  selectedDateChanged={setStartingTime}
                />
                <WorkoutMinutes
                  language={user.language}
                  minutesSelected={setMinutes}
                />
              </View>
            ) : (
              <View>
                <View className="flex-row">
                  <View className="w-1/2">
                    <WorkoutStartingTime
                      startingTimeChanged={setStartingTime}
                      minDate={now}
                    />
                  </View>
                  <View className="w-1/2">
                    <WorkoutMinutes
                      language={user.language}
                      minutesSelected={setMinutes}
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
          <View title={"Location"} style={style.slideStyle}>
            <WorkoutLocation
              initialShow={true}
              language={user.language}
              locationChanged={setLocation}
            />
          </View>
          <View title={"Sex and Description"} style={style.slideStyle}>
            <WorkoutSex
              size={40}
              isMale={user.isMale}
              language={user.language}
              sexChanged={setWorkoutSex}
            />
            <WorkoutDescription
              language={user.language}
              descChanged={setDescription}
            />
          </View>
        </ScrollView>
        {pageIndex == pages.length - 1 ? (
          <TouchableOpacity
            disabled={isCreateDisabled}
            onPress={createWorkout}
            className="rounded-full items-center py-3"
            style={{
              margin: 10,

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
            className="rounded-full items-center py-3"
            style={{
              margin: 10,
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

      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={alertTitle}
        message={alertMessage}
        closeOnTouchOutside={true}
        onDismiss={() => setShowAlert(false)}
        closeOnHardwareBackPress={true}
        showConfirmButton={true}
        confirmText={languageService[user.language].gotIt}
        confirmButtonColor="#DD6B55"
        onCancelPressed={() => {
          setShowAlert(false);
        }}
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
      />
    </View>
  );
};

export default CreateWorkoutScreen;
