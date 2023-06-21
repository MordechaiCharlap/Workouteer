import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as appStyle from "../../utils/appStyleSheet";

import React, { useRef, Children } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faChevronCircleLeft,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";
import languageService from "../../services/languageService";
import { convertHexToRgba } from "../../utils/stylingFunctions";
const AnimatedSlides = (props) => {
  const { user } = useAuth();
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
      <View className="flex-row">
        {Children.map(props.children, (child, index) => (
          <View>
            <Text>{child.props.title}</Text>
          </View>
        ))}
      </View>
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
          padding: 10,
          columnGap: 10,
        }}
      >
        <TouchableOpacity
          onPress={handlePrevPage}
          className="w-1 rounded grow items-center justify-center py-3"
          style={{
            borderWidth: 2,
            borderColor: convertHexToRgba(appStyle.color_primary, 0.15),
          }}
        >
          <Text
            className="font-black"
            style={{ color: appStyle.color_primary }}
          >
            {languageService[user.language].back.toUpperCase()}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNextPage}
          className="w-1 rounded grow items-center justify-center py-3"
          style={{ backgroundColor: appStyle.color_primary }}
        >
          <Text
            className="font-black"
            style={{ color: appStyle.color_background }}
          >
            {languageService[user.language].continue[
              user.isMale ? 1 : 0
            ].toUpperCase()}
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={handlePrevPage}>
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
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default AnimatedSlides;
