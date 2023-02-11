import {
  View,
  Text,
  StatusBar,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { React, useCallback, useEffect, useState } from "react";
import responsiveStyle from "../components/ResponsiveStyling";
import * as appStyle from "../components/AppStyleSheet";
import useNavbarNavigation from "../hooks/useNavbarNavigation";
import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import * as firebase from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { leagues } from "../services/defaultValues";
import useNavbarDisplay from "../hooks/useNavbarDisplay";

const LeaderboardScreen = () => {
  const navigation = useNavigation();
  const { setCurrentScreen } = useNavbarDisplay();
  const { setScreen } = useNavbarNavigation();
  const { user } = useAuth();
  const [leaderboardList, setLeaderboardList] = useState([]);
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("Leaderboard");
      setScreen("Leaderboard");
    }, [])
  );
  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (user.leaderboard.weekId != firebase.getLastWeekId()) {
        console.log("No leaderboard");
        setLeaderboardList();
        return;
      }
      const leaderboardData = (
        await getDoc(
          doc(
            firebase.db,
            `leaderboards/${user.league}/${user.leaderboard.weekId}/${user.leaderboard.id}`
          )
        )
      ).data();
      const usersArray = Array.from(Object.entries(leaderboardData.users)).sort(
        (a, b) => a[1].points < b[1].points
      );
      setLeaderboardList(usersArray);
    };
    fetchLeaderboard();
  }, []);
  return (
    <View style={responsiveStyle.safeAreaStyle}>
      <StatusBar
        backgroundColor={appStyle.statusBarStyle.backgroundColor}
        barStyle={appStyle.statusBarStyle.barStyle}
      />
      <View className="flex-1">
        <Header title={leagues[user.league] + " league"} />
        {leaderboardList == null ? (
          <Text
            className="text-center font-semibold text-lg"
            style={{
              backgroundColor: appStyle.color_primary,
              color: appStyle.color_on_primary,
            }}
          >
            Get some points in order to compete
          </Text>
        ) : (
          <FlatList
            data={leaderboardList}
            keyExtractor={(item) => item[0]}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={async () =>
                  item[0] == user.id
                    ? navigation.navigate("MyUser")
                    : navigation.navigate("User", {
                        shownUser: await firebase.getUserDataById(item[0]),
                        friendshipStatus: await firebase.checkFriendShipStatus(
                          user,
                          item[0]
                        ),
                      })
                }
                className="flex-row flex-1 items-center mt-2"
              >
                <Text
                  className={`text-4xl w-12 text-center ${
                    index < 3 ? "font-bold" : ""
                  }`}
                  style={{ color: appStyle.color_primary }}
                >
                  {index + 1}
                </Text>
                <Image
                  source={{
                    uri: item[1].img,
                  }}
                  className="h-14 w-14 bg-white rounded-full mr-4"
                />
                <Text
                  className="text-2xl font-semibold tracking-wider"
                  style={{ color: appStyle.color_primary }}
                >
                  {item[1].displayName}
                </Text>
                {/* <View>
                  <Text
                    className="text-xl font-semibold tracking-wider"
                    style={{ color: appStyle.color_primary }}
                  >
                    {item[1].displayName}
                  </Text>
                  <Text
                    className="text-md opacity-60 tracking-wider"
                    style={{ color: appStyle.color_primary }}
                  >
                    {item[0]}
                  </Text>
                </View> */}
                <Text
                  className="absolute right-3 my-auto text-2xl"
                  style={{ color: appStyle.color_primary }}
                >
                  {item[1].points}XP
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default LeaderboardScreen;
