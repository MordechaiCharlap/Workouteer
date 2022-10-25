import {
  Image,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { React, useContext, useEffect, useLayoutEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import BottomNavbar from "../components/BottomNavbar";
import ResponsiveStyling from "../components/ResponsiveStyling";
import * as appStyle from "../components/AppStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { firestoreImport } from "../firebase-config";
import {
  doc,
  updateDoc,
  arrayUnion,
  increment,
  getDoc,
  FieldValue,
} from "firebase/firestore";
import authContext from "../context/authContext";
const UserScreen = ({ route }) => {
  const { user } = useContext(authContext);
  const db = firestoreImport;
  const shownUser = route.params.shownUser;
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    console.log(shownUser);
    friendOptionInit();
    console.log(friendOption);
  }, []);
  const friendOptionInit = async () => {
    if (
      user.friends.some((element) => element.username == shownUser.username)
    ) {
      setFriendOption("Friends");
    } else {
      const userReqRef = await getDoc(doc(db, "requests", user.usernameLower));
      if (
        userReqRef
          .data()
          .ownRequests.some((element) => element.username == shownUser.username)
      ) {
        setFriendOption("SentRequest");
      } else if (
        userReqRef
          .data()
          .othersRequests.some(
            (element) => element.username == shownUser.username
          )
      ) {
        setFriendOption("GotRequest");
      }
    }
  };

  const [friendOption, setFriendOption] = useState("None");
  const sendFriendRequest = async () => {
    const userReqRef = doc(db, "requests", user.usernameLower);
    const userPath = `ownRequests.${shownUser.usernameLower}`;
    const shownUserReqRef = doc(db, "requests", shownUser.usernameLower);
    const shownUserPath = `othersRequests.${user.usernameLower}`;
    await updateDoc(userReqRef, {
      userPath: {
        img: shownUser.img,
        time: FieldValue.serverTimestamp(),
      },
    });
    await updateDoc(shownUserReqRef, {
      shownUserPath: {
        img: user.img,
        time: FieldValue.serverTimestamp(),
      },
    });
    setFriendOption("SentRequest");
  };
  const calculateAge = () => {
    const birthdate = shownUser.birthdate.toDate();
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
      <View className="flex-1 p-3">
        <View className="flex-row justify-between">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesomeIcon
              icon={faChevronLeft}
              size={30}
              color={appStyle.appGray}
            />
          </TouchableOpacity>
        </View>
        <Image
          source={{
            uri: shownUser.img,
          }}
          className="h-60 w-60 bg-white rounded-full mb-2 self-center"
        />
        <Text
          className="font-semibold text-4xl self-center"
          style={{
            color: appStyle.appGray,
          }}
        >
          {shownUser.username}
        </Text>
        <Text
          className="self-center font-bold text-xl tracking-wider"
          style={{ color: appStyle.appGray }}
        >
          {shownUser.firstName} {shownUser.lastName}, {calculateAge()}
        </Text>

        <View
          className="flex-row justify-around"
          style={style.workoutAndFriends}
        >
          <View className="items-center">
            <Text style={style.text} className="font-bold">
              {shownUser.workoutsCount}
            </Text>
            <Text style={style.text}>Workouts</Text>
          </View>
          <View className="items-center">
            <Text style={style.text} className="font-bold">
              {shownUser.friendsCount}
            </Text>
            <Text style={style.text}>Friends</Text>
          </View>
        </View>
        <View className="flex-row items-center self-center">
          <TouchableOpacity
            onPress={sendFriendRequest}
            style={style.socialButton}
          >
            <Text
              className="text-center text-xl"
              style={{ color: appStyle.appGray }}
            >
              Add as a friend
            </Text>
          </TouchableOpacity>
          {shownUser.isPublic == true && (
            <TouchableOpacity
              onPress={sendFriendRequest}
              style={style.socialButton}
            >
              <Text
                className="text-center text-xl"
                style={{ color: appStyle.appGray }}
              >
                Send a message
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <BottomNavbar currentScreen="User" />
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  text: {
    fontSize: 20,
    color: appStyle.appGray,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: appStyle.appGray,
    padding: 4,
    margin: 10,
    borderRadius: 5,
  },
});
export default UserScreen;
