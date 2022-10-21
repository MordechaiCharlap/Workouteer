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

const friendsData = [
  {
    id: 123,
    username: "AlmogVoid",
    workouts: 7,
    league: "Silver",
    img: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    isConnected: false,
  },
  {
    id: 456,
    username: "MisterBean",
    workouts: 3,
    league: "Bronze",
    img: "https://i.pinimg.com/originals/c5/c2/c1/c5c2c17e13246dd3aecf3955673da803.jpg",
    isConnected: false,
  },
  {
    id: 789,
    username: "Lagertha",
    workouts: 15,
    league: "Diamond",
    img: "https://historycouk.s3.eu-west-2.amazonaws.com/s3fs-public/2020-07/lagertha-interview.jpg",
    isConnected: true,
  },
  {
    id: 1,
    username: "AlmogVoid",
    workouts: 7,
    league: "Silver",
    img: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    isConnected: false,
  },
  {
    id: 4,
    username: "MisterBean",
    workouts: 3,
    league: "Bronze",
    img: "https://i.pinimg.com/originals/c5/c2/c1/c5c2c17e13246dd3aecf3955673da803.jpg",
    isConnected: false,
  },
  {
    id: 7,
    username: "Lagertha",
    workouts: 15,
    league: "Diamond",
    img: "https://historycouk.s3.eu-west-2.amazonaws.com/s3fs-public/2020-07/lagertha-interview.jpg",
    isConnected: true,
  },
  {
    id: 3,
    username: "AlmogVoid",
    workouts: 7,
    league: "Silver",
    img: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    isConnected: false,
  },
  {
    id: 6,
    username: "MisterBean",
    workouts: 3,
    league: "Bronze",
    img: "https://i.pinimg.com/originals/c5/c2/c1/c5c2c17e13246dd3aecf3955673da803.jpg",
    isConnected: false,
  },
  {
    id: 9,
    username: "Lagertha",
    workouts: 15,
    league: "Diamond",
    img: "https://historycouk.s3.eu-west-2.amazonaws.com/s3fs-public/2020-07/lagertha-interview.jpg",
    isConnected: true,
  },
];
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
