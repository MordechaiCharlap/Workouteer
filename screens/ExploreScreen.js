import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { React, useLayoutEffect, useContext, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import BottomNavbar from "../components/BottomNavbar";
import authContext from "../context/authContext";
import * as appStyle from "../components/AppStyleSheet";
import * as firebase from "../services/firebase";
import ResponsiveStyling from "../components/ResponsiveStyling";
const ExploreScreen = () => {
  const { user } = useContext(authContext);
  var data;
  const navigation = useNavigation();
  const [renderOption, setRenderOption] = useState("Explore");
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const fetchRequests = async () => {
    data = await firebase.getOthersRequests(user);
  };
  const renderExplorePage = () => {
    if (renderOption == "Friend requests") {
      console.log("rendering friends requests");
      console.log(data);
      return (
        <View>
          <FlatList
            data={data}
            keyExtractor={(item) => item.displayName}
            renderItem={({ item }) => {
              <View className="flex-row justify-between">
                <Image
                  source={{
                    uri: item.img,
                  }}
                  className="h-15 w-15 bg-white rounded-full mb-2 self-center"
                />
                <Text>{item.displayName}</Text>
                <TouchableOpacity className="bg-blue-500">
                  <Text className="text-gray-300">Accept!</Text>
                </TouchableOpacity>
              </View>;
            }}
          />
        </View>
      );
    }
  };
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="flex-1 p-3">
        <View className="flex-row justify-between">
          <TouchableOpacity onPress={() => setRenderOption("Friend requests")}>
            <Text
              className="text-2xl w-min bg-gray-500"
              style={style.socialButton}
            >
              Friend requests: {user.friendRequestCount}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text
              className="text-2xl w-min bg-gray-500"
              style={style.socialButton}
            >
              Notifications: {user.notifications?.length || 0}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {renderExplorePage()}
      <BottomNavbar currentScreen="Explore" />
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  socialButton: {
    borderColor: appStyle.appGray,
    borderWidth: 1,
    color: appStyle.appGray,
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
});
export default ExploreScreen;
