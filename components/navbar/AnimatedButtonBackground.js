import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { color_primary } from "../../utils/appStyleSheet";

export const AnimatedButtonBackround = ({ index, fixedWidth }) => {
  const position = useSharedValue(2);
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: position.value }],
      width: fixedWidth / 5, // Assuming you have 5 buttons in the navbar
    };
  });

  // Update the position when the index changes
  useEffect(() => {
    console.log(index);
    position.value = withTiming(index * (fixedWidth / 5));
    console.log(position.value);
  }, [index]);

  return (
    <Animated.View style={[styles.animatedView, animatedStyle]}>
      <View
        style={{
          backgroundColor: color_primary,
          flex: 1,
          width: "100%",
          borderRadius: 10,
        }}
      ></View>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  animatedView: {
    position: "absolute",
    top: 0,
    bottom: 0,
    padding: 5,
  },
});
