import { View, FlatList, Platform } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { safeAreaStyle } from "../components/safeAreaStyle";
import { useFocusEffect } from "@react-navigation/native";
import Header from "../components/Header";
import * as firebase from "../services/firebase";
import * as appStyle from "../utils/appStyleSheet";
import useAuth from "../hooks/useAuth";
import WorkoutComponent from "../components/WorkoutComponent";
import LoadingAnimation from "../components/LoadingAnimation";
import useAlerts from "../hooks/useAlerts";
import AlertDot from "../components/AlertDot";
import languageService from "../services/languageService";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import usePushNotifications from "../hooks/usePushNotifications";
import { doc, updateDoc } from "firebase/firestore";
import useFirebase from "../hooks/useFirebase";
import CustomText from "../components/basic/CustomText";
import CustomButton from "../components/basic/CustomButton";

const FutureWorkoutsScreen = ({ route }) => {
  const { setCurrentScreen } = useNavbarDisplay();
  const { schedulePushNotification } = usePushNotifications();
  const { db } = useFirebase();
  const { user } = useAuth();
  const shownUser = route.params?.shownUser || user;
  const isMyUser = shownUser.id == user.id;
  const { newWorkoutsAlerts, setNewWorkoutsAlerts } = useAlerts();
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
          await updateDoc(doc(db, `workouts/${workout.id}`), {
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
        const workoutsArr = await firebase.getFutureWorkouts(
          shownUser.plannedWorkouts
        );
        setWorkouts(workoutsArr);
        setInitialLoading(false);
      };
      const removeAllNewWorkoutsAlerts = async () => {
        await firebase.removeAllNewWorkoutsAlerts(user.id);
      };
      getWorkouts();
      if (isMyUser && Object.keys(newWorkoutsAlerts).length > 0) {
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
    // scheduleNotificationsForNewWorkouts();
  }, [workouts]);
  return (
    <View style={safeAreaStyle()}>
      <Header
        title={languageService[user.language].futureWorkouts}
        goBackOption={true}
      />
      <View
        className="flex-1"
        style={{ backgroundColor: appStyle.color_surface_variant }}
      >
        {initialLoading ? (
          <LoadingAnimation />
        ) : workouts.length == 0 ? (
          <View
            className="items-center gap-y-2"
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: appStyle.color_surface_variant,
            }}
          >
            <CustomText
              className="text-center font-semibold text-lg"
              style={{
                color: appStyle.color_on_surface_variant,
              }}
            >
              {languageService[user.language].youDontHaveScheduledWorkouts}
            </CustomText>
            <View className="flex-row items-center gap-x-2">
              <CustomButton
                style={{ backgroundColor: appStyle.color_on_background }}
                round
                onPress={() => navigation.navigate("SearchWorkouts")}
              >
                <CustomText
                  className="font-semibold text-lg"
                  style={{
                    color: appStyle.color_background,
                  }}
                >
                  {languageService[user.language].searchWorkouts}
                </CustomText>
              </CustomButton>
              <CustomButton
                round
                onPress={() => navigation.navigate("CreateWorkout")}
                style={{ backgroundColor: appStyle.color_on_background }}
              >
                <CustomText
                  className="font-semibold text-lg rounded-sm"
                  style={{
                    color: appStyle.color_background,
                  }}
                >
                  {languageService[user.language].createWorkout}
                </CustomText>
              </CustomButton>
            </View>
          </View>
        ) : (
          <FlatList
            // showsVerticalScrollIndicator={false}
            style={{
              paddingTop: 5,
            }}
            data={workouts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>
                <WorkoutComponent
                  workout={item}
                  isPastWorkout={false}
                  screen={"FutureWorkouts"}
                />
                {isMyUser && newWorkouts[item.id] && (
                  <View className="absolute right-1 bottom-1">
                    <AlertDot
                      textColor={appStyle.color_on_primary_container}
                      borderWidth={4}
                      borderColor={appStyle.color_surface_variant}
                      fontSize={15}
                      size={30}
                      color={appStyle.color_primary}
                    />
                  </View>
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
