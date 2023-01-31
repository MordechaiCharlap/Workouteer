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
const LeaderboardScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const { setScreen } = useNavbarNavigation();
  const { user } = useAuth();

  const [leaderboardList, setLeaderboardList] = useState([user]);
  const rank = user.rank == 1 ? "Bronze" : "Silver";
  useFocusEffect(
    useCallback(() => {
      setScreen("Leaderboard");
    }, [])
  );
  useEffect(() => {
    const fetchLeaderboard = async () => {
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
      <Header title={rank + " league"} />
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
      <BottomNavbar currentScreen="Leaderboard" />
    </View>
  );
};

export default LeaderboardScreen;
