import { View, Text, TouchableOpacity } from "react-native";
import * as appStyle from "../../utils/appStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faX, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import React from "react";

const BackOrExitButton = (props) => {
  return (
    <View className="flex-row px-2">
      <TouchableOpacity
        onPress={props.handlePrevPage}
        style={{ marginTop: 20 }}
      >
        <FontAwesomeIcon
          icon={props.firstPage ? faX : faChevronLeft}
          size={props.style.size}
          color={props.style.color}
        />
      </TouchableOpacity>
    </View>
  );
};

export default BackOrExitButton;
