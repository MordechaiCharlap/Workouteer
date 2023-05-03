import { View, FlatList, StatusBar, Platform } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { safeAreaStyle } from "../components/safeAreaStyle";
import { useFocusEffect } from "@react-navigation/native";
import Header from "../components/Header";
import * as firebase from "../services/firebase";
import * as appStyle from "../utilities/appStyleSheet";
import useAuth from "../hooks/useAuth";
import WorkoutComponent from "../components/WorkoutComponent";
import LoadingAnimation from "../components/LoadingAnimation";
import useAlerts from "../hooks/useAlerts";
import AlertDot from "../components/AlertDot";
import languageService from "../services/languageService";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import usePushNotifications from "../hooks/usePushNotifications";
import { doc, updateDoc } from "firebase/firestore";

const FutureWorkoutsScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  const { schedulePushNotification } = usePushNotifications();
  const { user } = useAuth();
  const { newWorkoutsAlerts, setNewWorkoutsAlerts } = useAlerts();
  const now = new Date();
  const [newWorkouts, setNewWorkouts] = useState();
  const [workouts, setWorkouts] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const scheduleNotificationsForNewWorkouts = useCallback(async () => {
    if (newWorkouts && Object.keys(newWorkouts).length > 0) {
      for (var workout of workouts) {
        if (workout.members[user.id].notificationId == null) {
          var scheduledNotificationId;
          if (Platform.OS != "web") {
            scheduledNotificationId = await schedulePushNotification(
              workout.startingTime,
              "Workout session started!",
              "Don't forget to confirm your workout to get your points :)"
            );
          }
          await updateDoc(doc(firebase.db, `workouts/${workout.id}`), {
            [`members.${user.id}.notificationId`]: scheduledNotificationId,
          });
        }
      }
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("FutureWorkouts");
      const getWorkouts = async () => {
        console.log("getting workouts");
        const workoutsArr = await firebase.getFutureWorkouts(user, now);
        setWorkouts(workoutsArr);
        setInitialLoading(false);
      };
      const removeAllNewWorkoutsAlerts = async () => {
        await firebase.removeAllNewWorkoutsAlerts(user.id);
      };
      getWorkouts();
      if (Object.keys(newWorkoutsAlerts).length > 0) {
        setNewWorkouts(newWorkoutsAlerts);
        scheduleNotificationsForNewWorkouts();
        setNewWorkoutsAlerts({});
        removeAllNewWorkoutsAlerts();
      } else {
        setNewWorkouts({});
      }
    }, [])
  );
  useEffect(() => {
    scheduleNotificationsForNewWorkouts();
  }, [workouts]);
  return (
    <View style={safeAreaStyle()}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <Header
        title={languageService[user.language].futureWorkouts}
        goBackOption={true}
      />
      <View className="flex-1 px-4">
        {initialLoading ? (
          <LoadingAnimation />
        ) : (
          <FlatList
            className="p-2"
            showsVerticalScrollIndicator={false}
            data={workouts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>
                <WorkoutComponent
                  workout={item}
                  isPastWorkout={false}
                  screen={"FutureWorkouts"}
                />
                {newWorkouts[item.id] != null ? (
                  <View className="absolute left-0 top-6">
                    <AlertDot
                      text={languageService[user.language].new}
                      textColor={appStyle.color_on_primary}
                      borderWidth={5}
                      borderColor={appStyle.color_bg}
                      fontSize={20}
                      size={60}
                      color={appStyle.color_primary}
                    />
                  </View>
                ) : (
                  <></>
                )}
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default FutureWorkoutsScreen;
