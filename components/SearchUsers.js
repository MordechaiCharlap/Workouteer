import {
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Text,
  ScrollView,
} from "react-native";
import { React, useState } from "react";

import * as appStyle from "../components/AppStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import * as firebase from "../services/firebase";
const SearchUsers = (props) => {
  const [searchedUser, setSearchedUser] = useState(null);
  const textChanged = async (text) => {
    if (text != "") {
      props.isEmpty(false);
      const searchedUserDoc = await firebase.searchUser(text);
      if (searchedUserDoc != null) setSearchedUser(searchedUserDoc.data());
    } else {
      props.isEmpty(true);
    }
  };
  const renderSearchedUser = () => {
    if (searchedUser != null) {
      return (
        <TouchableOpacity
          onPress={() => props.userClicked(searchedUser)}
          className="flex-row items-center mt-2"
        >
          <Image
            source={{
              uri: searchedUser.img,
            }}
            className="h-14 w-14 bg-white rounded-full mr-4"
          />
          <View>
            <Text
              className="text-xl font-semibold tracking-wider"
              style={{ color: appStyle.color_primary }}
            >
              {searchedUser.username}
            </Text>
            <Text
              className="text-md opacity-60 tracking-wider"
              style={{ color: appStyle.color_primary }}
            >
              {searchedUser.displayName}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
  };
  return (
    <ScrollView>
      <View
        className="rounded-xl mt-4 p-3"
        style={{ backgroundColor: appStyle.color_darker }}
      >
        <View className="flex-row items-center">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            size={24}
            color={appStyle.color_on_primary}
          />
          <TextInput
            onChangeText={(text) => textChanged(text)}
            style={{ color: appStyle.color_on_primary }}
            placeholder="Search"
            placeholderTextColor={appStyle.color_on_primary}
            className="text-xl ml-3"
          />
        </View>
      </View>
      {renderSearchedUser()}
    </ScrollView>
  );
};
export default SearchUsers;
