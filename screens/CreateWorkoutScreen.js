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
import AwesomeModal from "../components/AwesomeModal";
import { Title } from "../components/slides/Title";
import BackOrExitButton from "../components/slides/BackOrExitButton";
import CustomButton from "../components/basic/CustomButton";
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
  const [workoutSex, setWorkoutSex] = useState();
  const [location, setLocation] = useState(null);
  const [description, setDescription] = useState("");
  const [isCreateDisabled, setIsCreateDisabled] = useState(false);
  const [continueDisabled, setContinueDisabled] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [delayPassed, setDelayPassed] = useState(false);
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
      x: currentPageIndexRef.current * fixedWidth,
      y: 0,
    });
  };
  useEffect(() => {
    setTimeout(() => {
      setDelayPassed(true);
    }, 500);
  }, []);
  useEffect(() => {
    let disabled = false;
    switch (pageIndex) {
      case 0:
        disabled = type == null;
        break;
      case 1:
        if (minutes == null || startingTime == null) {
          disabled = true;
        } else if (!checkIfWorkoutTimeAvailable()) disabled = true;

        break;
      case 2:
        disabled = location == null;
        break;
    }

    setContinueDisabled(disabled);
  }, [pageIndex, type, minutes, startingTime, location]);
  const style = StyleSheet.create({
    slideStyle: {
      rowGap: 15,
      paddingTop: 20,
      width: fixedWidth,
      paddingHorizontal: 16,
    },
    container: {
      paddingHorizontal: 16,
    },
    placeholderStyle: {
      color: "#5f6b8b",
      fontSize: 16,
    },
  });
  const backOrExitButtonStyle = {
    color: appStyle.color_on_background,
    size: 25,
  };
  const componentsColor = appStyle.color_on_background;
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("CreateWorkout");
    }, [])
  );
  const checkIfWorkoutTimeAvailable = () => {
    const closestWorkoutDateAfter =
      workoutUtils.checkIfDateAvailableAndReturnClosestWorkout(
        user,
        startingTime
      );
    if (closestWorkoutDateAfter == false) {
      setStartingTime(null);

      setAlertTitle(
        languageService[user.language].alreadyScheduledAWorkoutThisDate
      );
      setAlertMessage(
        languageService[user.language].chooseAnotherDate[user.isMale ? 1 : 0]
      );
      setShowAlert(true);
      return false;
    } else {
      if (
        closestWorkoutDateAfter != null &&
        new Date(startingTime.getTime() + minutes * 60000) >
          closestWorkoutDateAfter
      ) {
        setAlertTitle(
          languageService[user.language].yourWorkoutOverlappingOtherWorkout
        );
        setAlertMessage(
          languageService[user.language].tryToScheduleAnEearlierWorkout
        );
        setShowAlert(true);
        return false;
      }
    }
    return true;
  };
  const createWorkout = async () => {
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
    const newWorkoutData = await firebase.createWorkout(workout);
    navigation.replace("WorkoutDetails", {
      workout: newWorkoutData,
      isCreator: true,
      isPastWorkout: false,
      userMemberStatus: "creator",
    });

    await sendPushNotificationForFriendsAboutWorkout(workoutSex, type);
  };
  return (
    <View style={safeAreaStyle()}>
      <BackOrExitButton
        style={backOrExitButtonStyle}
        firstPage={pageIndex == 0}
        handlePrevPage={handlePrevPage}
      />

      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        ref={scrollViewRef}
        pagingEnabled={true}
        scrollEnabled={false}
        onMomentumScrollEnd={handleScrollEnd}
      >
        <View style={style.slideStyle}>
          <Title
            title={languageService[user.language].workoutType}
            icon={faX}
            color={componentsColor}
          />
          <View>
            <WorkoutType
              color={componentsColor}
              value={user.lastWorkoutCreation?.type}
              language={user.language}
              typeSelected={(type) => {
                setType(type);
              }}
            />
          </View>
        </View>

        <View style={style.slideStyle}>
          <Title
            color={componentsColor}
            title={languageService[user.language].dateAndDuration}
            icon={faChevronLeft}
          />
          <View>
            {Platform.OS == "web" ? (
              <>
                <NextWeekDropdown
                  color={componentsColor}
                  value={startingTime}
                  language={user.language}
                  now={now}
                  selectedDateChanged={setStartingTime}
                />
                <View style={{ height: 10 }}></View>
                <WorkoutMinutes
                  color={componentsColor}
                  value={user.lastWorkoutCreation?.minutes}
                  language={user.language}
                  minutesSelected={setMinutes}
                />
              </>
            ) : (
              <View
                style={{
                  flexDirection:
                    user.language == "hebrew" ? "row" : "row-reverse",
                }}
              >
                <View className="w-1 grow">
                  <WorkoutMinutes
                    color={componentsColor}
                    value={user.lastWorkoutCreation?.minutes}
                    language={user.language}
                    minutesSelected={setMinutes}
                  />
                </View>
                <View style={{ width: 10 }}></View>
                <View className="w-1 grow">
                  <WorkoutStartingTime
                    color={componentsColor}
                    value={startingTime}
                    startingTimeChanged={setStartingTime}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
        <View style={style.slideStyle}>
          <Title
            color={componentsColor}
            title={
              languageService[user.language].chooseLocation[user.isMale ? 1 : 0]
            }
            icon={faChevronLeft}
          />
          <View>
            {delayPassed && (
              <WorkoutLocation
                color={componentsColor}
                value={user.lastWorkoutCreation?.location}
                language={user.language}
                locationChanged={setLocation}
              />
            )}
          </View>
        </View>
        <View style={style.slideStyle}>
          <Title
            color={componentsColor}
            title={languageService[user.language].preferences}
            icon={faChevronLeft}
          />
          <WorkoutSex
            color={componentsColor}
            value={user.lastWorkoutCreation?.sex}
            size={40}
            isMale={user.isMale}
            language={user.language}
            sexChanged={setWorkoutSex}
          />
          <WorkoutDescription
            color={componentsColor}
            descChanged={setDescription}
          />
        </View>
      </ScrollView>
      {pageIndex == pages.length - 1 ? (
        <CustomButton
          disabled={isCreateDisabled}
          onPress={createWorkout}
          style={{
            margin: 16,
            padding: 16,
            backgroundColor: appStyle.color_on_background,
          }}
        >
          <Text
            className="font-black text-lg"
            style={{ color: appStyle.color_background }}
          >
            {loading
              ? languageService[user.language].loading.toUpperCase()
              : languageService[user.language].createWorkout.toUpperCase()}
          </Text>
        </CustomButton>
      ) : (
        <CustomButton
          disabled={continueDisabled}
          onPress={handleNextPage}
          style={{
            margin: 16,
            padding: 16,
            borderRadius: 999,
            backgroundColor: continueDisabled
              ? appStyle.color_surface_variant
              : appStyle.color_on_background,
          }}
        >
          <Text
            className="font-black text-lg"
            style={{
              color: continueDisabled
                ? appStyle.color_on_surface_variant
                : appStyle.color_background,
            }}
          >
            {languageService[user.language].continue[
              user.isMale ? 1 : 0
            ].toUpperCase()}
          </Text>
        </CustomButton>
      )}
      <AwesomeModal
        showModal={showAlert}
        showProgress={false}
        title={alertTitle}
        message={alertMessage}
        closeOnTouchOutside={true}
        onDismiss={() => setShowAlert(false)}
        closeOnHardwareBackPress={true}
        showConfirmButton={true}
        confirmText={languageService[user.language].gotIt}
        confirmButtonColor="#DD6B55"
        onConfirmPressed={() => {
          setShowAlert(false);
        }}
      />
    </View>
  );
};

export default CreateWorkoutScreen;
