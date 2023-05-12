import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as appStyle from "../../utilities/appStyleSheet";

import React, { useRef, Children } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChevronCircleLeft,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
const AnimatedSlides = (props) => {
  const scrollViewRef = useRef(null);
  const currentPageIndexRef = useRef(0);
  const horizontal = props.horizontal != null ? props.horizontal : true;
  const width = props.width;
  const height = props.height;
  const handleNextPage = () => {
    if (Children.count(props.children) == currentPageIndexRef.current + 1)
      return;
    currentPageIndexRef.current++;
    scroll();
  };
  const handlePrevPage = () => {
    if (currentPageIndexRef.current == 0) return;
    currentPageIndexRef.current--;

    scroll();
  };
  const scroll = () => {
    horizontal
      ? scrollViewRef.current.scrollTo({
          animated: true,
          x: currentPageIndexRef.current * width,
          y: 0,
        })
      : scrollViewRef.current.scrollTo({
          animated: true,
          x: 0,
          y: currentPageIndexRef.current * height,
        });
  };
  return (
    <View className="flex-1">
      <ScrollView
        horizontal={horizontal}
        ref={scrollViewRef}
        pagingEnabled={true}
      >
        {props.children}
      </ScrollView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          paddingVertical: 10,
        }}
      >
        <TouchableOpacity onPress={handlePrevPage}>
          <FontAwesomeIcon
            icon={faChevronCircleLeft}
            color={appStyle.color_primary}
            size={50}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNextPage}>
          <FontAwesomeIcon
            icon={faChevronCircleRight}
            color={appStyle.color_primary}
            size={50}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AnimatedSlides;
