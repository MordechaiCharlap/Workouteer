import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import CustomButton from "../basic/CustomButton";
import * as appStyle from "../../utils/appStyleSheet";
import WorkoutComponent from "../WorkoutComponent";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";
import useExplore from "../../hooks/useExplore";
import CustomText from "../basic/CustomText";
import languageService from "../../services/languageService";
import LoadingAnimation from "../LoadingAnimation";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const LatestWorkouts = ({ containerColor, onContainerColor }) => {
  const { user } = useAuth();
  const { latestWorkouts, refreshLatestWorkouts, refreshing } = useExplore();
  useEffect(() => {
    refreshLatestWorkouts();
  }, []);
  useEffect(() => {
    if (refreshing) {
      latestWorkoutsOpacity.value = 0;
      latestWorkoutsMarginTop.value = 20;
    } else {
      latestWorkoutsOpacity.value = withTiming(1);
      latestWorkoutsMarginTop.value = withTiming(0);
    }
  }, [refreshing]);
  const latestWorkoutsOpacity = useSharedValue(0);
  const latestWorkoutsMarginTop = useSharedValue(20);
  const latestWorkoutsAnimatedStyle = useAnimatedStyle(() => {
    return {
      marginTop: latestWorkoutsMarginTop.value,
      opacity: latestWorkoutsOpacity.value,
    };
  });
  return (
    <View className="flex-1">
      {/* <View
        style={{
          paddingHorizontal: 16,
          borderBottomColor: appStyle.color_outline,
          borderBottomWidth: 0.5,
        }}
      >
        <CustomButton
          onPress={!refreshing ? refreshLatestWorkouts : () => {}}
          className="self-start mb-2 flex-row"
          style={{ backgroundColor: appStyle.color_primary, width: "35%" }}
        >
          {!refreshing ? (
            <FontAwesomeIcon
              icon={faRotateRight}
              color={appStyle.color_on_primary}
              size={25}
            />
          ) : (
            <ActivityIndicator
              size={Platform.OS == "android" ? 30 : "small"}
              color={appStyle.color_on_primary}
            />
          )}

          <View style={{ width: 10 }} />
          <CustomText style={{ color: appStyle.color_on_primary }}>
            {!refreshing
              ? languageService[user.language].refresh
              : languageService[user.language].loading}
          </CustomText>
        </CustomButton>
      </View> */}
      {refreshing ? (
        <LoadingAnimation />
      ) : (
        <View
          className="flex-1"
          style={{
            backgroundColor: appStyle.color_surface_variant,
            rowGap: 5,
          }}
        >
          <CustomText
            className="font-semibold text-xl"
            style={{
              marginHorizontal: 16,
              marginTop: 5,
              color: appStyle.color_on_surface_variant,
            }}
          >
            {languageService[user.language].latestConfirmedWorkoutsWorldwide}
          </CustomText>
          <View
            className="flex-1"
            style={{
              borderTopColor: appStyle.color_outline,
              borderTopWidth: 1,
            }}
          >
            <Animated.FlatList
              style={[latestWorkoutsAnimatedStyle]}
              contentContainerStyle={{ paddingTop: 5 }}
              data={latestWorkouts}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <WorkoutComponent workout={item} isPastWorkout={true} />
              )}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default LatestWorkouts;
