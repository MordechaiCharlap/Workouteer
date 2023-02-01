import {
  View,
  Text,
  StatusBar,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import {
  React,
  useLayoutEffect,
  useCallback,
  useEffect,
  useState,
} from "react";
import responsiveStyle from "../components/ResponsiveStyling";
import BottomNavbar from "../components/BottomNavbar";
import * as appStyle from "../components/AppStyleSheet";
import useNavbarNavigation from "../hooks/useNavbarNavigation";
import Header from "../components/Header";
import useAuth from "../hooks/useAuth";
import * as firebase from "../services/firebase";
import { doc, getDoc, getDocs, query } from "firebase/firestore";
const LeaderboardScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const { setScreen } = useNavbarNavigation();
  const { user } = useAuth();
  const [leaderboardList, setLeaderboardList] = useState();
  const rank = user.rank == 1 ? "Bronze" : "Silver";
  useFocusEffect(
    useCallback(() => {
      setScreen("Leaderboard");
    }, [])
  );
  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (user.leaderboard.weekId != firebase.getLastWeekId()) return;
      const leaderboardData = (
        await getDoc(
          doc(
            firebase.db,
            `leaderboards/${user.rank}/${user.leaderboard.weekId}/${user.leaderboard.id}`
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
        <Header title={rank + " league"} />
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
            renderItem={({ item }) => (
              <TouchableOpacity className="flex-row flex-1 items-center mt-2">
                <Image
                  source={{
                    uri: item[1].img,
                  }}
                  className="h-14 w-14 bg-white rounded-full mr-4"
                />
                <View>
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
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
      <BottomNavbar currentScreen="Leaderboard" />
    </View>
  );
};

export default LeaderboardScreen;
