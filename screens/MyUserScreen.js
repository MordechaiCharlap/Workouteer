import { Image, SafeAreaView, View, Text, StyleSheet } from "react-native";
import { React, useContext, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import BottomNavbar from "../components/BottomNavbar";
import ResponsiveStyling from "../components/ResponsiveStyling";
import authContext from "../context/authContext";
const userData = {
  firstName: "Moti",
  lastName: "Charlap",
  username: "Fasteriko",
  league: "Emerald",
  age: 24,
  workouts: 53,
  friendsCount: 23,
};
const MyUserScreen = () => {
  const { user } = useContext(authContext);
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

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <SafeAreaView style={ResponsiveStyling.safeAreaStyle}>
      <View className="items-center flex-1">
        <Image
          source={{
            uri: "https://i.pinimg.com/564x/39/44/28/394428dcf049dbc614b3a34cef24c164.jpg",
          }}
          className="h-60 w-60 bg-white rounded-full mt-8 mb-5"
        />
        <Text className="font-bold text-3xl">{user.username}</Text>
        <View className="flex-row justify-around w-full ">
          <View className="leftView">
            <Text
              style={styles.text}
            >{`Name: ${user.firstName} ${user.lastName}`}</Text>
            <Text style={styles.text}>{`Age: ${calculateAge()}`}</Text>
          </View>
          <View className="rightView">
            <Text style={styles.text}>{`Workouts: ${userData.workouts}`}</Text>
            <Text
              style={styles.text}
            >{`Friends: ${userData.friendsCount}`}</Text>
          </View>
        </View>
      </View>
      <BottomNavbar currentScreen="MyUser" />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  text: { fontSize: 20 },
});
export default MyUserScreen;
