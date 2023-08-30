import { View, TouchableOpacity, Image } from "react-native";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import CustomText from "../basic/CustomText";
import * as appStyle from "../../utils/appStyleSheet";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../../hooks/useAuth";
import {
  faArrowLeft,
  faChevronLeft,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

const ChatHeader = ({
  otherUser,
  selectedMessages,
  clearSelectedMessages,
  deleteSelectedMessages,
}) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const renderUserHeader = () => {
    return (
      <View className="flex-row items-center" style={{ height: "100%" }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesomeIcon
            icon={faChevronLeft}
            size={40}
            color={appStyle.color_on_surface}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Profile", {
              shownUser: otherUser,
            })
          }
          className="flex-row flex-1 items-center"
          style={{ columnGap: 5 }}
        >
          <Image
            source={{
              uri: otherUser.img,
            }}
            className="h-14 w-14 bg-white rounded-full"
          />
          <CustomText
            numberOfLines={1}
            className="text-2xl font-semibold flex-1 text-center"
            style={{ color: appStyle.color_on_surface }}
          >
            {otherUser.displayName}
          </CustomText>
        </TouchableOpacity>
      </View>
    );
  };
  const renderSelectedMessagesHeader = () => {
    return (
      <View
        className="flex-row items-center justify-between"
        style={{ height: "100%", paddingHorizontal: 16 }}
      >
        <TouchableOpacity onPress={clearSelectedMessages}>
          <FontAwesomeIcon
            icon={faArrowLeft}
            color={appStyle.color_on_surface}
            size={30}
          />
        </TouchableOpacity>

        <CustomText
          className="font-semibold"
          numberOfLines={1}
          style={{ color: appStyle.color_on_surface, fontSize: 30 }}
        >
          {selectedMessages.length}
        </CustomText>
        <TouchableOpacity onPress={deleteSelectedMessages}>
          <FontAwesomeIcon
            icon={faTrashCan}
            color={appStyle.color_on_surface}
            size={30}
          />
        </TouchableOpacity>
      </View>
    );
  };
  console.log(selectedMessages.length);
  return (
    <View
      style={{
        backgroundColor: appStyle.color_surface,
        height: 70,
        borderBottomColor: appStyle.color_outline,
        borderBottomWidth: 0.5,
      }}
    >
      {selectedMessages.length > 0
        ? renderSelectedMessagesHeader()
        : renderUserHeader()}
    </View>
  );
};

export default ChatHeader;
