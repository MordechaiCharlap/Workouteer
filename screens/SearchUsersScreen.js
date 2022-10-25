import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { React, useContext, useEffect, useLayoutEffect, useState } from "react";
import BottomNavbar from "../components/BottomNavbar";
import { useNavigation } from "@react-navigation/native";
import ResponsiveStyling from "../components/ResponsiveStyling";
import * as appStyle from "../components/AppStyleSheet";
import { ResponsiveShadow } from "../components/ResponsiveStyling";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { firestoreImport } from "../services/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
const SearchUsersScreen = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const firestore = firestoreImport;
  const usersRef = collection(firestore, "users");
  useEffect(() => {}, []);
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const searchClicked = async () => {
    if (searchText != "") {
      const docRef = await getDoc(
        doc(firestore, "users", searchText.toLowerCase())
      );
      if (docRef != null) setSearchedUser(docRef.data());
    }
  };
  const renderSearchedUser = () => {
    if (searchedUser != null) {
      console.log(searchedUser);
      return (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("User", { shownUser: searchedUser })
          }
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
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="flex-1 p-2">
        <View>
          <Text
            className="text-4xl font-bold text-center"
            style={{ color: appStyle.appGray }}
          >
            Search By Username
          </Text>
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
          {renderSearchedUser()}
        </View>
      </View>

      <BottomNavbar currentScreen="Friends" />
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  profileImg: {
    borderColor: appStyle.appDarkBlue,
    borderWidth: 0.1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0 /* Make the picture taking the size of it's parent */,
    // width: "100%" /* This if for the object-fit */,
    width: "100%" /* This if for the object-fit */,
    objectFit:
      "cover" /* Equivalent of the background-size: cover; of a background-image */,
    objectPosition: "center",
  },
});
export default SearchUsersScreen;
