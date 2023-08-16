import { View, Text, FlatList, Image } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { React, useCallback, useEffect, useState } from "react";
import { safeAreaStyle } from "../components/safeAreaStyle";
import * as appStyle from "../utils/appStyleSheet";
import useNavbarNavigation from "../hooks/useNavbarNavigation";
import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import * as firebase from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import languageService from "../services/languageService";
import CountdownTimer from "../components/leaderboardScreen/CountdownTimer";
import CustomText from "../components/basic/CustomText";
import CustomButton from "../components/basic/CustomButton";
import useFirebase from "../hooks/useFirebase";
import CurrentLeague from "../components/leaderboardScreen/CurrentLeague";
import useLeaderboard from "../hooks/useLeaderboard";
const LeaderboardScreen = () => {
  const navigation = useNavigation();
  const { setCurrentScreen } = useNavbarDisplay();
  const { setScreen } = useNavbarNavigation();
  const { user } = useAuth();
  const { leaderboardList } = useLeaderboard();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("Leaderboard");
      setScreen("Leaderboard");
    }, [])
  );

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
        <View style={{ paddingHorizontal: 16 }}>
          <CurrentLeague league={user.league} />
          <CountdownTimer language={user.language} />
        </View>
        {!leaderboardList ? (
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: appStyle.color_surface_variant,
            }}
          >
            <Text
              className="text-center font-semibold text-lg"
              style={{
                color: appStyle.color_on_surface_variant,
              }}
            >
              {languageService[user.language].getPointsToCompete}
            </Text>
            <View
              className={`flex-row${
                user.language == "hebrew" ? "-reverse" : ""
              } items-center justify-center gap-x-2`}
              style={{ paddingVertical: 8 }}
            >
              <CustomButton
                style={{ backgroundColor: appStyle.color_on_background }}
                round
                onPress={() => navigation.navigate("SearchWorkouts")}
              >
                <Text
                  className="font-semibold text-lg"
                  style={{
                    color: appStyle.color_background,
                  }}
                >
                  {languageService[user.language].searchWorkouts}
                </Text>
              </CustomButton>
              <CustomButton
                round
                style={{ backgroundColor: appStyle.color_on_background }}
                onPress={() => navigation.navigate("CreateWorkout")}
              >
                <Text
                  className="font-semibold text-lg rounded-sm"
                  style={{
                    color: appStyle.color_background,
                  }}
                >
                  {languageService[user.language].createWorkout}
                </Text>
              </CustomButton>
            </View>
          </View>
        ) : (
          <FlatList
            style={{ backgroundColor: appStyle.color_surface }}
            data={leaderboardList}
            keyExtractor={(item) => item[0]}
            renderItem={({ item, index }) => (
              <CustomButton
                className={`flex-row${
                  user.language == "hebrew" ? "-reverse" : ""
                } items-center`}
                onPress={async () =>
                  item[0] == user.id
                    ? navigation.navigate("MyProfile")
                    : navigation.navigate("Profile", {
                        shownUser: await firebase.getUserDataById(item[0]),
                      })
                }
                style={{
                  borderBottomWidth: 0.5,
                  borderBottomColor: appStyle.color_outline,
                  justifyContent: "flex-start",
                  borderRadius: 0,
                  flex: 1,
                  backgroundColor:
                    item[0] == user.id ? appStyle.color_primary_container : "",
                }}
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
                  <CustomText
                    className="text-4xl w-12 text-center"
                    style={{
                      fontSize: 36,
                      color:
                        item[0] == user.id
                          ? appStyle.color_on_primary_container
                          : appStyle.color_on_surface,
                      width: 48,
                      textAlign: "center",
                    }}
                  >
                    {index + 1}
                  </CustomText>
                )}

                <Image
                  source={{
                    uri: item[0] == user.id ? user.img : item[1].img,
                  }}
                  className={`h-14 w-14 bg-white rounded-full ${
                    user.language == "hebrew" ? "ml-4" : "mr-4"
                  }`}
                />
                <CustomText
                  className="tracking-wider"
                  style={{
                    fontSize: 24,
                    fontWeight: 600,
                    color:
                      item[0] == user.id
                        ? appStyle.color_on_primary_container
                        : appStyle.color_on_surface,
                  }}
                >
                  {item[1].displayName}
                </CustomText>

                <CustomText
                  className="absolute right-3 my-auto text-2xl"
                  style={
                    item[0] == user.id
                      ? { color: appStyle.color_on_primary_container }
                      : { color: appStyle.color_on_surface }
                  }
                >
                  {item[1].points}XP
                </CustomText>
              </CustomButton>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default LeaderboardScreen;
