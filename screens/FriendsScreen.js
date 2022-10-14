import { View, Text, SafeAreaView, FlatList } from "react-native";
import { React, useLayoutEffect } from "react";
import BottomNavbar from "../components/BottomNavbar";
import { useNavigation } from "@react-navigation/native";

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
    <SafeAreaView className="flex-1 bg-cyan-900">
      <View className="flex-1">
        <FlatList
          data={friendsData}
          keyExtractor={(item) => item.id}
          renderItem={(user) => (
            <View className="bg-slate-500 border-2 rounded w-full h-24 m-4"></View>
          )}
        />
      </View>
      <BottomNavbar />
    </SafeAreaView>
  );
};

export default FriendsScreen;
