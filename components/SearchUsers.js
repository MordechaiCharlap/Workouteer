import { View, TouchableOpacity, TextInput } from "react-native";
import { React, useContext, useState } from "react";

import * as appStyle from "../components/AppStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import * as firebase from "../services/firebase";
import authContext from "../context/authContext";
const SearchUsers = () => {
  const { user } = useContext(authContext);
  const [searchText, setSearchText] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);

  const searchClicked = async () => {
    if (searchText != "") {
      const docRef = await firebase.searchUser(searchText);
      if (docRef != null) setSearchedUser(docRef.data());
    }
  };
  const renderSearchedUser = () => {
    if (searchedUser != null) {
      console.log(searchedUser);
      return (
        <TouchableOpacity
          onPress={() => userClicked(searchedUser)}
          style={{
            backgroundColor: appStyle.appLightBlue,
            marginTop: 1,
          }}
          className={`p-2 h-16 flex-row ${ResponsiveShadow}`}
        >
          <View className="items-center aspect-square">
            <Image
              source={{
                uri: searchedUser.img,
              }}
              className="rounded-full aspect-square"
              style={style.profileImg}
            />
          </View>
          <View className="justify-center" style={{ flexBasis: "76%" }}>
            <Text
              className="text-xl font-semibold text-center"
              style={{ color: appStyle.appDarkBlue }}
            >
              {searchedUser.username}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
  };
  return (
    <View
      className="rounded-xl mt-4 p-3"
      style={{ backgroundColor: appStyle.appDarkBlueGrayer }}
    >
      <View className="flex-row items-center">
        <TouchableOpacity onPress={searchClicked}>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            size={24}
            color={appStyle.appDarkBlue}
          />
        </TouchableOpacity>
        <TextInput
          onChangeText={(text) => setSearchText(text)}
          style={{ color: appStyle.appGray }}
          placeholder="Search"
          placeholderTextColor={appStyle.appDarkBlue}
          className="text-xl ml-3"
        />
      </View>
    </View>
  );
};

export default SearchUsers;
