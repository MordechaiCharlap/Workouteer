import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import { React, useLayoutEffect, useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import BottomNavbar from "../components/BottomNavbar";
import authContext from "../context/authContext";
import * as appStyle from "../components/AppStyleSheet";
import ResponsiveStyling from "../components/ResponsiveStyling";
const ExploreScreen = () => {
  const { user } = useContext(authContext);
  const navigation = useNavigation();
  const [renderOption, setRenderOption] = useState("Explore");
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const renderExplorePage = () => {
    if (renderOption == "Friend requests") {
      return (
        <View>
          <FlatList
            data={user.othersRequests}
            keyExtractor={(item) => item.username}
            renderItem={({ item }) => {
              <View className="flex-row justify-between">
                <Image
                  source={{
                    uri: item.img,
                  }}
                  className="h-15 w-15 bg-white rounded-full mb-2 self-center"
                />
                <Text>{item.username}</Text>
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
              Friend requests: {user.othersRequests?.length || 0}
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
