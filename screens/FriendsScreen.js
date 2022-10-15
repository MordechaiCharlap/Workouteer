import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  FlatList,
  Platform,
} from "react-native";
import { React, useLayoutEffect } from "react";
import BottomNavbar from "../components/BottomNavbar";
import { useNavigation } from "@react-navigation/native";
import safeAreaStyle from "../components/ResponsiveSafeView";
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
    img: "https://www.pexels.com/photo/monochrome-photography-of-person-laughing-1484799/",
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
];

const FriendsScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <SafeAreaView className="flex-1 bg-cyan-900" style={safeAreaStyle}>
      <View className=" bg-orange-500 flex-1">
        <FlatList
          data={friendsData}
          keyExtractor={(item) => item.id}
          renderItem={(user) => (
            <View className="bg-slate-500 border-4 border-stone-400 rounded h-24 mt-4 mr-4 ml-4 mb-1 flex-row">
              <View
                className="bg-white items-center"
                style={{ flexBasis: "24%" }}
              >
                <Image
                  source={{
                    uri: "https://i.pinimg.com/564x/39/44/28/394428dcf049dbc614b3a34cef24c164.jpg",
                  }}
                  className="rounded-full"
                  style={style.profileImg}
                />
              </View>
              <View className="bg-pink-600" style={{ flexBasis: "76%" }}></View>
            </View>
          )}
        />

        <BottomNavbar currentScreen="Friends" />
      </View>
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  profileImg: {
    position: "absolute" /* Take your picture out of the flow */,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0 /* Make the picture taking the size of it's parent */,
    // width: "100%" /* This if for the object-fit */,
    height: "100%" /* This if for the object-fit */,
    aspectRatio: "1/1",
    objectFit:
      "cover" /* Equivalent of the background-size: cover; of a background-image */,
    objectPosition: "center",
  },
});
export default FriendsScreen;
