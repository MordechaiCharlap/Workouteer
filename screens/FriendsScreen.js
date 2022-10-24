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
import { React, useLayoutEffect } from "react";
import BottomNavbar from "../components/BottomNavbar";
import { useNavigation } from "@react-navigation/native";
import ResponsiveStyling from "../components/ResponsiveStyling";
import * as appStyle from "../components/AppStyleSheet";
import { ResponsiveShadow } from "../components/ResponsiveStyling";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const FriendsScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View
        className="rounded-xl mt-4 p-3"
        style={{ backgroundColor: appStyle.appDarkBlueGrayer }}
      >
        <View className="flex-row items-center">
          <TouchableOpacity>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              size={24}
              color={appStyle.appDarkBlue}
            />
          </TouchableOpacity>
          <TextInput
            style={{ color: appStyle.appGray }}
            placeholder="Search"
            placeholderTextColor={appStyle.appDarkBlue}
            className="text-xl ml-3"
          />
        </View>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        className="flex-1 "
        data={friendsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              backgroundColor: appStyle.appLightBlue,
              marginTop: 1,
            }}
            className={`p-2 h-16 flex-row ${ResponsiveShadow}`}
          >
            <View className="items-center aspect-square">
              <Image
                source={{
                  uri: item.img,
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
                {item.username}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
export default FriendsScreen;
