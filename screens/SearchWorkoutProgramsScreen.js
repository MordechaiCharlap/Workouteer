import { View, Text, FlatList } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useFirebase from "../hooks/useFirebase";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {
  color_background,
  color_on_background,
  color_outline,
  color_surface,
  color_surface_variant,
} from "../utils/appStyleSheet";
import CustomText from "../components/basic/CustomText";
import CustomButton from "../components/basic/CustomButton";
import appComponentsDefaultStyles from "../utils/appComponentsDefaultStyles";
import Header from "../components/Header";

const SearchWorkoutProgramsScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  const { user } = useAuth();
  const navigation = useNavigation();
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
      where("isPublic", "==", "true"),
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
      {(searchResults == null && topPrograms.length == 0) ||
      (searchResults.length == 0 && topPrograms.length == 0) ? (
        <View className="flex-1 justify-center">
          <View
            className="self-center"
            style={[
              {
                rowGap: 10,
                borderRadius: 16,
                borderWidth: 0.5,
                borderColor: color_outline,
                backgroundColor: color_surface,
                padding: 16,
              },
              appComponentsDefaultStyles.shadow,
            ]}
          >
            <CustomText className="font-semibold text-xl text-center">
              No public workout programs found.
            </CustomText>
            <CustomButton
              onPress={() =>
                navigation.replace("WorkoutPrograms", {
                  createProgramOnEntering: true,
                })
              }
              round
              style={{ backgroundColor: color_on_background }}
            >
              <CustomText
                className="font-semibold"
                style={{ color: color_background }}
              >
                Create your own
              </CustomText>
            </CustomButton>
          </View>
        </View>
      ) : (
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
              <View className="w-full">
                <View className="flex-row">
                  <CustomText>Followers: </CustomText>
                  <CustomText className="font-semibold">
                    {item.currentUsersCount}
                  </CustomText>
                </View>
                <View className="flex-row">
                  <CustomText>Workouts: </CustomText>
                  <CustomText className="font-semibold">
                    {item.workouts.length}
                  </CustomText>
                </View>
              </View>
            </CustomButton>
          )}
        />
      )}
    </View>
  );
};

export default SearchWorkoutProgramsScreen;
