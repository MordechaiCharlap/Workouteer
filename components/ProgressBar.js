import { View } from "react-native";
import React, { useEffect } from "react";
import {
  color_outline,
  color_primary,
  color_surface_variant,
} from "../utils/appStyleSheet";
import appComponentsDefaultStyles from "../utils/appComponentsDefaultStyles";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const ProgressBar = ({
  value,
  previousValue,
  total,
  backgroundColor,
  color,
}) => {
  const progress = useSharedValue(previousValue || 0);
  const animatedListStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value / (total / 100)}%`,
    };
  }, []);
  useEffect(() => {
    progress.value = withTiming(value);
  }, [value]);

  return (
    <View
      className="w-full h-full"
      style={[
        {
          borderRadius: 10,
          backgroundColor: backgroundColor,
          borderWidth: 0.5,
          borderColor: color_outline,
        },
      ]}
    >
      <Animated.View
        className="h-full"
        style={[
          {
            borderRadius: 10,
            backgroundColor: color,
          },
          animatedListStyle,
        ]}
      ></Animated.View>
    </View>
  );
};

export default ProgressBar;
