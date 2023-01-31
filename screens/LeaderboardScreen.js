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
import { db } from "../services/firebase";
import { getDoc } from "firebase/firestore";
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
      if (user.leaderboard.id == null || user.leaderboard.points == 0) return;
      const startingTime = user.leaderboard.startingTime.toDate();

      const date = new Date();
      const lastSunday = new Date();
      lastSunday.setDate(date.getDate() - date.getDay());
      console.log(lastSunday);
      if (
        startingTime != null &&
        startingTime.getFullYear() === lastSunday.getFullYear() &&
        startingTime.getMonth() === lastSunday.getMonth() &&
        startingTime.getDate() === lastSunday.getDate()
      ) {
        const leaderboardList = await getDoc(
          doc(db, `leaderboards/${user.rank}/${user.leaderboard.id}`)
        );
        setLeaderboardList(leaderboardList);
      } else {
        return;
      }
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
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity className="flex-row flex-1 items-center mt-2">
                <Image
                  source={{
                    uri: item.img,
                  }}
                  className="h-14 w-14 bg-white rounded-full mr-4"
                />
                <View>
                  <Text
                    className="text-xl font-semibold tracking-wider"
                    style={{ color: appStyle.color_primary }}
                  >
                    {item.id}
                  </Text>
                  <Text
                    className="text-md opacity-60 tracking-wider"
                    style={{ color: appStyle.color_primary }}
                  >
                    {item.displayName}
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
