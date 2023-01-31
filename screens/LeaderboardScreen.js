import { View, Text, StatusBar } from "react-native";
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
import { FlatList } from "react-native-gesture-handler";
const LeaderboardScreen = () => {
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });

  const { setScreen } = useNavbarNavigation();
  const { user } = useAuth();

  const [leaderboardList, setLeaderboardList] = useState([]);
  const rank = user.rank == 1 ? "Bronze" : "Silver";
  useFocusEffect(
    useCallback(() => {
      setScreen("Leaderboard");
    }, [])
  );
  useEffect(() => {
    const fetchLeaderboard = async () => {};
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
      </View>
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
