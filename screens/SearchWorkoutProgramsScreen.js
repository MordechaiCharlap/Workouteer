import { View, Text, FlatList } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useFirebase from "../hooks/useFirebase";
import { useFocusEffect } from "@react-navigation/native";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Animated from "react-native-reanimated";
import { color_surface_variant } from "../utils/appStyleSheet";
import CustomText from "../components/basic/CustomText";
import CustomButton from "../components/basic/CustomButton";
import appComponentsDefaultStyles from "../utils/appComponentsDefaultStyles";
import Header from "../components/Header";

const SearchWorkoutProgramsScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  const { user } = useAuth();
  const { db } = useFirebase();
  const [topPrograms, setTopPrograms] = useState([]);
  const [searchResults, setSearchResults] = useState();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("SearchWorkoutPrograms");
    }, [])
  );
  const setTopFivePrograms = () => {
    const topFiveQuery = query(
      collection(db, "workoutPrograms"),
      orderBy("currentUsersCount", "desc"),
      limit(5)
    );
    getDocs(topFiveQuery).then((snap) => {
      const arr = [];
      snap.forEach((doc) => {
        arr.push(doc.data());
      });
      setTopPrograms(arr);
    });
  };
  useEffect(() => {
    setTopFivePrograms();
  }, []);
  return (
    <View className="flex-1">
      <Header goBackOption={true} title={"Explore new programs"} />
      <CustomText className="text-xl" style={{ marginHorizontal: 16 }}>
        {!searchResults ? "Most popular programs:" : "Search results:"}
      </CustomText>
      <FlatList
        style={{}}
        data={!searchResults ? topPrograms : searchResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CustomButton
            style={[
              {
                marginHorizontal: 16,
                backgroundColor: color_surface_variant,
                marginVertical: 8,
              },
              appComponentsDefaultStyles.shadow,
            ]}
          >
            <CustomText className="font-bold text-xl">{item.name}</CustomText>
          </CustomButton>
        )}
      />
    </View>
  );
};

export default SearchWorkoutProgramsScreen;
