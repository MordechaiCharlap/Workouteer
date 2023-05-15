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
import { safeAreaStyle } from "../components/safeAreaStyle";
import * as appStyle from "../utilities/appStyleSheet";
import useNavbarNavigation from "../hooks/useNavbarNavigation";
import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import * as firebase from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import languageService from "../services/languageService";
import CountdownTimer from "../components/leaderboardScreen/CountdownTimer";
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
        (a, b) => b[1].points - a[1].points
      );
      setLeaderboardList(usersArray);
    };
    fetchLeaderboard();
  }, []);
  return (
    <View style={safeAreaStyle()}>
      <View className="flex-1">
        <Header
          title={
            user.language == "hebrew"
              ? languageService[user.language].leagueTitles[user.league]
              : languageService[user.language].leagues[user.league] +
                " " +
                languageService[user.language].league
          }
        />
        <CountdownTimer language={user.language} />

        {leaderboardList.findIndex(
          (element) => element[0] == user.id && element[1].points == 0
        ) != -1 ? (
          <View
            className="p-2 gap-y-2"
            style={{
              backgroundColor: appStyle.color_primary,
            }}
          >
            <Text
              className="text-center font-semibold text-lg"
              style={{
                color: appStyle.color_on_primary,
              }}
            >
              {languageService[user.language].getPointsToCompete}
            </Text>
            <View className="flex-row items-center justify-center gap-x-2">
              <TouchableOpacity
                onPress={() => navigation.navigate("FindWorkout")}
              >
                <Text
                  className="font-semibold text-lg rounded-sm p-2"
                  style={{
                    backgroundColor: appStyle.color_bg,
                    color: appStyle.color_primary,
                  }}
                >
                  {languageService[user.language].findWorkout}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("CreateWorkout")}
              >
                <Text
                  className="font-semibold text-lg rounded-sm p-2"
                  style={{
                    backgroundColor: appStyle.color_bg,
                    color: appStyle.color_primary,
                  }}
                >
                  {languageService[user.language].createWorkout}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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
                className="flex-row flex-1 items-center py-1"
                style={
                  item[0] == user.id
                    ? { backgroundColor: appStyle.color_bg_variant }
                    : {}
                }
              >
                {index < 3 ? (
                  <Image
                    key={index}
                    source={
                      index == 0
                        ? require("../assets/leaderboard/medal-rank-1-transparent-bg.png")
                        : index == 1
                        ? require("../assets/leaderboard/medal-rank-2-transparent-bg.png")
                        : require("../assets/leaderboard/medal-rank-3-transparent-bg.png")
                    }
                    className="w-12 h-12"
                  />
                ) : (
                  <Text
                    className="text-4xl w-12 text-center"
                    style={
                      item[0] == user.id
                        ? { color: appStyle.color_on_primary }
                        : { color: appStyle.color_primary }
                    }
                  >
                    {index + 1}
                  </Text>
                )}

                <Image
                  source={{
                    uri: item[1].img,
                  }}
                  className="h-14 w-14 bg-white rounded-full mr-4"
                />
                <Text
                  className="text-2xl font-semibold tracking-wider"
                  style={
                    item[0] == user.id
                      ? { color: appStyle.color_on_primary }
                      : { color: appStyle.color_primary }
                  }
                >
                  {item[1].displayName}
                </Text>

                <Text
                  className="absolute right-3 my-auto text-2xl"
                  style={
                    item[0] == user.id
                      ? { color: appStyle.color_on_primary }
                      : { color: appStyle.color_primary }
                  }
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
