import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { React, useLayoutEffect } from "react";
import BottomNavbar from "../components/BottomNavbar";
import { useNavigation } from "@react-navigation/native";
import safeAreaStyle from "../components/ResponsiveSafeView";
import * as appStyle from "../components/AppStyleSheet";

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
    <SafeAreaView style={safeAreaStyle} className="flex-1 ">
      <FlatList
        showsVerticalScrollIndicator={false}
        className="flex-1 "
        data={friendsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              backgroundColor: appStyle.appLightBlue,
              borderColor: appStyle.abbDarkBlue,
            }}
            className="shadow rounded-lg p-2 h-24 mt-4 mr-4 ml-4 mb-1 flex-row"
          >
            <View className="items-center" style={{ aspectRatio: "1/1" }}>
              <Image
                source={{
                  uri: item.img,
                }}
                className="rounded-full "
                style={style.profileImg}
              />
            </View>
            <View
              className="justify-center text-center"
              style={{ flexBasis: "76%" }}
            >
              <Text
                className="text-xl font-semibold"
                style={{ color: appStyle.abbDarkBlue }}
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
    borderColor: appStyle.abbDarkBlue,
    borderWidth: "0.1rem",
    position: "absolute" /* Take your picture out of the flow */,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0 /* Make the picture taking the size of it's parent */,
    // width: "100%" /* This if for the object-fit */,
    width: "100%" /* This if for the object-fit */,
    aspectRatio: "1/1",
    objectFit:
      "cover" /* Equivalent of the background-size: cover; of a background-image */,
    objectPosition: "center",
  },
});
export default FriendsScreen;
