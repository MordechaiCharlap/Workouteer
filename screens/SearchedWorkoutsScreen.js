import { View, FlatList } from "react-native";
import React, { useCallback } from "react";
import { safeAreaStyle } from "../components/safeAreaStyle";
import Header from "../components/Header";
import WorkoutComponent from "../components/WorkoutComponent";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import languageService from "../services/languageService";
import useAuth from "../hooks/useAuth";
import * as appStyle from "../utils/appStyleSheet";
import CustomText from "../components/basic/CustomText";
import CustomButton from "../components/basic/CustomButton";

const SearchedWorkoutsScreen = ({ route }) => {
  const { user } = useAuth();
  const { setCurrentScreen } = useNavbarDisplay();
  const navigation = useNavigation();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("SearchedWorkouts");
    }, [])
  );
  const workouts = route.params.workouts;

  return (
    <View style={safeAreaStyle()}>
      <Header
        title={languageService[user.language].results}
        goBackOption={true}
      />
      <View className="flex-1">
        {workouts.length == 0 ? (
          <View
            className="items-center gap-y-2"
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: appStyle.color_surface_variant,
            }}
          >
            <CustomText
              className="text-center font-semibold text-lg"
              style={{
                color: appStyle.color_on_surface_variant,
              }}
            >
              {languageService[user.language].noWorkoutsMatchedYourSearch}
            </CustomText>
            <View className="flex-row items-center gap-x-2">
              <CustomButton
                style={{ backgroundColor: appStyle.color_on_background }}
                round
                onPress={() => navigation.replace("SearchWorkouts")}
              >
                <CustomText
                  className="font-semibold text-lg"
                  style={{
                    color: appStyle.color_background,
                  }}
                >
                  {languageService[user.language].changeFilters}
                </CustomText>
              </CustomButton>
              <CustomButton
                round
                onPress={() => navigation.replace("CreateWorkout")}
                style={{ backgroundColor: appStyle.color_on_background }}
              >
                <CustomText
                  className="font-semibold text-lg rounded-sm"
                  style={{
                    color: appStyle.color_background,
                  }}
                >
                  {languageService[user.language].createWorkout}
                </CustomText>
              </CustomButton>
            </View>
          </View>
        ) : (
          <FlatList
            data={workouts}
            style={{
              backgroundColor: appStyle.color_surface_variant,
              paddingTop: 5,
            }}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <WorkoutComponent
                location={route.params.location}
                workout={item}
                isPastWorkout={false}
              />
            )}
          />
        )}
      </View>
    </View>
  );
};

export default SearchedWorkoutsScreen;
