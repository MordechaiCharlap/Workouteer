import { workoutTypes } from "../WorkoutType";
import React, { useCallback, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import * as appStyle from "../../utils/appStyleSheet";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import useResponsiveness from "../../hooks/useResponsiveness";
import CustomButton from "../basic/CustomButton";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
const ConfirmCurrentWorkoutButton = (props) => {
  const { windowHeight } = useResponsiveness();
  const navigation = useNavigation();
  buttonHeight = windowHeight / 10;
  const iconSize = windowHeight / 15;
  const buttonPaddingTop = useSharedValue(80);
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      paddingTop: buttonPaddingTop.value,
    };
  });
  useFocusEffect(
    useCallback(() => {
      buttonPaddingTop.value = 80;
      setTimeout(() => {
        buttonPaddingTop.value = withSpring(0, {
          damping: 100,
          mass: 2,
          stiffness: 100,
          overshootClamping: true,
        });
      }, 700);
    }, [])
  );
  return (
    <Animated.View
      style={[
        {
          bottom: 0,
          width: "100%",
          position: "absolute",
          alignItems: "center",
          height: buttonHeight,
        },
        buttonAnimatedStyle,
      ]}
    >
      <CustomButton
        onPress={() => navigation.navigate("ConfirmWorkout")}
        style={{
          height: buttonHeight,
          aspectRatio: 2,
          borderTopRightRadius: 999,
          borderTopLeftRadius: 999,
          itemsAlign: "center",
          justifyContent: "flex-end",
          backgroundColor: appStyle.color_primary,
          paddingBottom: 2,
        }}
      >
        <FontAwesomeIcon
          icon={workoutTypes[props.currentWorkout.type].icon}
          size={iconSize}
          color={appStyle.color_on_primary}
        />
      </CustomButton>
    </Animated.View>
  );
};

export default ConfirmCurrentWorkoutButton;
