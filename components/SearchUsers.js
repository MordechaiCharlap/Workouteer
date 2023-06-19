import {
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Text,
  ScrollView,
} from "react-native";
import { React, useState } from "react";

import * as appStyle from "../utilities/appStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import languageService from "../services/languageService";
import * as firebase from "../services/firebase";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import CustomTextInput from "./basic/CustomTextInput";
const SearchUsers = (props) => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [searchedUser, setSearchedUser] = useState(null);
  const textChanged = async (text) => {
    if (text != "") {
      props.isEmpty?.(false);
      const searchedUserDoc = await firebase.searchUser(text);
      if (searchedUserDoc != null) setSearchedUser(searchedUserDoc.data());
    } else {
      props.isEmpty?.(true);
    }
  };
  const userClicked = async (userData) => {
    const friendshipStatus = await firebase.checkFriendShipStatus(
      user,
      userData.id
    );
    navigation.navigate("Profile", {
      shownUser: userData,
      friendshipStatus: friendshipStatus,
    });
  };
  const renderSearchedUser = () => {
    return (
      <TouchableOpacity
        onPress={() => userClicked(searchedUser)}
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
            style={{ color: appStyle.color_on_background }}
          >
            {searchedUser.id}
          </Text>
          <Text
            className="text-md opacity-60 tracking-wider"
            style={{ color: appStyle.color_on_background }}
          >
            {searchedUser.displayName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <ScrollView>
      <View
        className="rounded-xl mt-4 p-3"
        style={{ backgroundColor: appStyle.color_surface_variant }}
      >
        <View
          className={`items-center gap-x-2 flex-row${
            props.language == "hebrew" ? "-reverse" : ""
          }`}
        >
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            size={24}
            color={appStyle.color_on_surface_variant}
          />
          <TextInput
            onChangeText={(text) => textChanged(text)}
            style={{ color: appStyle.color_on_surface_variant, flex: 1 }}
            placeholder={languageService[props.language].searchUser}
            placeholderTextColor={appStyle.color_on_surface_variant}
            className="text-xl"
          />
        </View>
      </View>
      {searchedUser != null && renderSearchedUser()}
    </ScrollView>
  );
};
export default SearchUsers;
