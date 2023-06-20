import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useFirebase from "../hooks/useFirebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import CustomButton from "./basic/CustomButton";
import * as appStyle from "../utilities/appStyleSheet";
import WorkoutComponent from "./WorkoutComponent";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faRotateRight, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import useResponsiveness from "../hooks/useResponsiveness";
import CustomText from "./basic/CustomText";
import languageService from "../services/languageService";

const Explore = () => {
  const { user } = useAuth();
  const { windowHeight } = useResponsiveness();
  const [latestWorkouts, setLatestWorkouts] = useState();
  const { db } = useFirebase();
  const refreshButtonProgress = useSharedValue(180);
  const refreshButtonOpacity = useSharedValue(0);
  const flatlistProgress = useSharedValue(windowHeight);
  const [refreshIcon, setRefreshIcon] = useState(faRotateRight);
  const animatedFlatlistStyle = useAnimatedStyle(() => {
    return { marginTop: flatlistProgress.value };
  }, []);
  const loadingOpacity = useSharedValue(1);
  const loadingAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: loadingOpacity.value,
    };
  }, []);
  const reanimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: refreshButtonOpacity.value,
      borderRadius: refreshButtonProgress.value / 3 + 8,
      transform: [{ rotate: `${refreshButtonProgress.value}deg` }],
    };
  }, []);
  const refreshLatestWorkouts = async () => {
    refreshButtonProgress.value = withSpring(180);
    const data = [];
    const q = query(
      collection(db, "workouts"),
      where("confirmed", "==", true),
      orderBy("startingTime", "desc"),
      limit(10)
    );
    (await getDocs(q)).forEach((doc) => {
      data.push({ ...doc.data(), id: doc.id });
    });
    setLatestWorkouts(data);
  };
  useEffect(() => {
    const getLatestWorkouts = async () => {
      const data = [];
      const q = query(
        collection(db, "workouts"),
        where("confirmed", "==", true),
        orderBy("startingTime", "desc"),
        limit(10)
      );
      (await getDocs(q)).forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      setLatestWorkouts(data);
      flatlistProgress.value = withTiming(0, { duration: 2000 });
      loadingOpacity.value = withTiming(0, { duration: 1000 });
    };
    getLatestWorkouts();
  }, []);
  useAnimatedReaction(
    () => {
      return flatlistProgress.value;
    },
    (value) => {
      if (value == 0) {
        refreshButtonProgress.value = withSpring(0);
        refreshButtonOpacity.value = withSpring(1);
      }
    }
  );
  return (
    <View>
      <Animated.View className="absolute w-full" style={[loadingAnimatedStyle]}>
        <CustomText className="self-center text-lg m-5">
          {languageService[user.language].loading}
        </CustomText>
      </Animated.View>
      <View style={{ paddingHorizontal: 16 }}>
        <Animated.View
          className="self-start my-2"
          style={[reanimatedStyle, { backgroundColor: appStyle.color_primary }]}
        >
          <TouchableOpacity
            onPress={refreshLatestWorkouts}
            className="self-center"
            style={{ margin: 16 }}
          >
            <FontAwesomeIcon
              icon={refreshIcon}
              color={appStyle.color_on_primary}
              size={25}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
      <View>
        <Animated.FlatList
          style={[{ paddingHorizontal: 16 }, animatedFlatlistStyle]}
          data={latestWorkouts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <WorkoutComponent workout={item} isPastWorkout={true} />
          )}
        />
      </View>
    </View>
  );
};

export default Explore;
