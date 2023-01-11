import { View, FlatList, StatusBar } from "react-native";
import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import responsiveStyle from "../components/ResponsiveStyling";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import * as firebase from "../services/firebase";
import * as appStyle from "../components/AppStyleSheet";
import useAuth from "../hooks/useAuth";
import WorkoutComponent from "../components/WorkoutComponent";
import LoadingAnimation from "../components/LoadingAnimation";
import useAlerts from "../hooks/useAlerts";
import AlertDot from "../components/AlertDot";
const FutureWorkoutsScreen = () => {
  const navigation = useNavigation();

  const { user } = useAuth();
  const { workoutRequestsAcceptedAlerts, setWorkoutRequestsAcceptedAlerts } =
    useAlerts();
  const now = new Date();
  const [newWorkouts, setNewWorkouts] = useState();
  const [workouts, setWorkouts] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  useFocusEffect(
    useCallback(() => {
      const getWorkouts = async () => {
        console.log("getting workouts");
        const workoutsArr = await firebase.getFutureWorkouts(user, now);
        setWorkouts(workoutsArr);
        setInitialLoading(false);
      };
      const removeAllWorkoutRequestAcceptedAlerts = async () => {
        await firebase.removeAllWorkoutRequestAcceptedAlerts(user.id);
      };
      getWorkouts();
      if (Object.keys(workoutRequestsAcceptedAlerts).length > 0) {
        const mockNewWorkouts = {
          jf5yxRrQI7EuS2bkvLZT: {
            workoutDate: new Date(),
            acceptedDate: new Date(),
          },
          jf5yxRrQI7E12uS2bkvLZT: {
            workoutDate: new Date(),
            acceptedDate: new Date(),
          },
        };
        setNewWorkouts(workoutRequestsAcceptedAlerts);
        setWorkoutRequestsAcceptedAlerts({});
        removeAllWorkoutRequestAcceptedAlerts();
      } else {
        setNewWorkouts({});
      }
    }, [])
  );
  return (
    <View style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <Header title="Future workouts" goBackOption={true} />
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
                  <View className="absolute left-0 top-7">
                    <AlertDot
                      text="new!"
                      textColor={appStyle.color_on_primary}
                      borderWidth={5}
                      borderColor={appStyle.color_bg}
                      fontSize={20}
                      size={65}
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
