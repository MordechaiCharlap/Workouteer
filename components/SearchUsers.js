import {
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Text,
  ScrollView,
  FlatList,
} from "react-native";
import { React, useEffect, useState } from "react";

import * as appStyle from "../utils/appStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import languageService from "../services/languageService";
import * as firebase from "../services/firebase";
import { useNavigation } from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import CustomTextInput from "./basic/CustomTextInput";
import appComponentsDefaultStyles from "../utils/appComponentsDefaultStyles";
import useAppData from "../hooks/useAppData";
import { collection, getDocs, query, where } from "firebase/firestore";
import useFirebase from "../hooks/useFirebase";
const SearchUsers = (props) => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const { usersData } = useAppData();
  const { db } = useFirebase();
  const [shownUsers, setShownUsers] = useState([]);
  const filterIdsBySearchedText = (searchedText) => {
    const matchingUserIds = usersData.allUsersIds.filter((userId) =>
      userId.includes(searchedText.toLowerCase())
    );
    return matchingUserIds;
  };
  useEffect(() => {
    console.log(usersData);
  }, []);
  const textChanged = async (text) => {
    if (text.length >= 3) {
      const matchingUsers = filterIdsBySearchedText(text);
      console.log(matchingUsers);
      if (matchingUsers.length == 0) return;
      const firstTen = matchingUsers.slice(0, 10);
      const q = query(
        collection(db, "users"),
        where("__name__", "in", firstTen)
      );
      const querySnapshot = await getDocs(q);
      const usersDataArr = [];
      querySnapshot.forEach((doc) => {
        usersDataArr.push(doc.data());
      });
      console.log(usersDataArr.length);
      setShownUsers(usersDataArr);

      // const searchedUserDoc = await firebase.searchUser(text);
      // if (searchedUserDoc != null) setSearchedUser(searchedUserDoc.data());
    }
  };
  const userClicked = async (userData) => {
    if (userData.id == user.id) {
      navigation.navigate("MyProfile");
    } else {
      const friendshipStatus = await firebase.checkFriendShipStatus(
        user,
        userData.id
      );
      navigation.navigate("Profile", {
        shownUser: userData,
        friendshipStatus: friendshipStatus,
      });
    }
  };
  renderShownUsers = () => {
    return (
      <FlatList
        data={shownUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{ paddingHorizontal: 16 }}
            onPress={() => userClicked(item)}
            className="flex-row items-center mt-2"
          >
            <Image
              source={{
                uri: item.img,
              }}
              className="h-14 w-14 bg-white rounded-full mr-4"
            />
            <View>
              <Text
                className="text-xl font-semibold tracking-wider"
                style={{ color: appStyle.color_on_background }}
              >
                {item.id}
              </Text>
              <Text
                className="text-md opacity-60 tracking-wider"
                style={{ color: appStyle.color_on_background }}
              >
                {item.displayName}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    );
  };

  return (
    <View>
      <View
        style={{
          backgroundColor: appStyle.color_surface_variant,
          padding: 16,
        }}
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
          <CustomTextInput
            onChangeText={(text) => textChanged(text)}
            style={{ color: appStyle.color_on_surface_variant }}
            placeholder={languageService[props.language].searchUser}
            placeholderTextColor={appStyle.color_on_surface_variant}
            className="text-xl"
          />
        </View>
      </View>
      {shownUsers.length > 0 && renderShownUsers()}
    </View>
  );
};
export default SearchUsers;
