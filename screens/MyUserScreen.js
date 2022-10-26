import {
  Image,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { React, useContext, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import BottomNavbar from "../components/BottomNavbar";
import ResponsiveStyling from "../components/ResponsiveStyling";
import authContext from "../context/authContext";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPencil, faSliders } from "@fortawesome/free-solid-svg-icons";
import * as appStyle from "../components/AppStyleSheet";
const MyUserScreen = () => {
  const { user } = useContext(authContext);

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  const ChangePreferences = () => {
    console.log("moving to preferences");
    navigation.navigate("ChangePreferences");
  };
  const calculateAge = () => {
    const birthdate = user.birthdate.toDate();
    var today = new Date();
    var age = today.getFullYear() - birthdate.getFullYear();
    var m = today.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }
    console.log(age);
    return age;
  };

  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="flex-1">
        <ScrollView>
          <View className="p-4">
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() => navigation.navigate("ChangePreferences")}
              >
                <FontAwesomeIcon
                  icon={faSliders}
                  size={40}
                  color={appStyle.appGray}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <FontAwesomeIcon
                  icon={faPencil}
                  size={40}
                  color={appStyle.appGray}
                />
              </TouchableOpacity>
            </View>
            <View className="flex-row mt-6 mb-3">
              <Image
                source={{
                  uri: user.img,
                }}
                className="h-32 w-32 bg-white rounded-full mb-2 self-center"
              />
              <View className="flex-row flex-1 justify-around">
                <TouchableOpacity className="items-center">
                  <Text style={style.text} className="font-bold">
                    {user.workoutsCount}
                  </Text>
                  <Text style={style.text}>Workouts</Text>
                </TouchableOpacity>
                <TouchableOpacity className="items-center">
                  <Text style={style.text} className="font-bold">
                    {user.friendsCount}
                  </Text>
                  <Text style={style.text}>Friends</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text
              className="font-semibold text-2xl"
              style={{
                color: appStyle.appGray,
              }}
            >
              {user.displayName}
            </Text>
            <Text style={{ color: appStyle.appGray }} className="text-lg">
              No description yet.
            </Text>
          </View>
        </ScrollView>
      </View>
      <BottomNavbar currentScreen="MyUser" />
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  text: {
    fontSize: 20,
    color: appStyle.appGray,
  },
  workoutAndFriends: {
    borderBottomColor: appStyle.appAzure,
    borderBottomWidth: 1,
  },
});
export default MyUserScreen;
