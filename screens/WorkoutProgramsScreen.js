import { View, Text, FlatList, StyleSheet } from "react-native";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as appStlye from "../utils/appStyleSheet";
import CustomText from "../components/basic/CustomText";
import CustomButton from "../components/basic/CustomButton";
import { safeAreaStyle } from "../components/safeAreaStyle";
import Header from "../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faMagnifyingGlass,
  faStopwatch,
} from "@fortawesome/free-solid-svg-icons";
import useAuth from "../hooks/useAuth";
import { collection, getDocs, query, where } from "firebase/firestore";
import useFirebase from "../hooks/useFirebase";
import appComponentsDefaultStyles from "../utils/appComponentsDefaultStyles";
const WorkoutProgramsScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { db } = useFirebase();
  const [savedWorkoutPrograms, setSavedWorkoutPrograms] = useState();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("WorkoutPrograms");
    }, [])
  );
  useEffect(() => {
    const savedProgramsQuery = query(
      collection(db, "workoutPrograms"),
      where("__name__", "in", user.savedWorkoutPrograms)
    );
    getDocs(savedProgramsQuery).then((querySnapshot) => {
      const programs = [];
      querySnapshot.forEach((doc) => {
        programs.push({ ...doc.data(), id: doc.id });
      });

      setSavedWorkoutPrograms(programs);
    });
  }, []);
  return (
    <View style={safeAreaStyle()}>
      <Header goBackOption={true} title={"My Programs"} />
      <View style={{ paddingHorizontal: 16 }}>
        <View
          className="flex-row justify-end"
          style={{
            columnGap: 5,
          }}
        >
          <CustomButton
            className="flex-row"
            onPress={() => navigation.navigate("IntervalTimer")}
            round
            style={{
              backgroundColor: appStlye.color_surface_variant,
            }}
          >
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              size={15}
              color={appStlye.color_on_background}
            />
            <CustomText
              style={{ color: appStlye.color_on_background, marginLeft: 3 }}
            >
              Search new
            </CustomText>
          </CustomButton>
          <CustomButton
            className="flex-row"
            onPress={() => navigation.navigate("IntervalTimer")}
            round
            style={{ backgroundColor: appStlye.color_on_background }}
          >
            <FontAwesomeIcon
              icon={faStopwatch}
              size={15}
              color={appStlye.color_background}
            />
            <CustomText
              style={{ color: appStlye.color_background, marginLeft: 3 }}
            >
              Interval timer
            </CustomText>
          </CustomButton>
        </View>

        <CustomText style={{ fontWeight: 600, fontSize: 30 }}>
          Saved Programs
        </CustomText>
        {savedWorkoutPrograms && savedWorkoutPrograms.length > 0 && (
          <FlatList
            data={savedWorkoutPrograms}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CustomButton
                style={[
                  {
                    backgroundColor: appStlye.color_surface_variant,
                    borderRadius: 4,
                    paddingVertical: 20,
                    paddingHorizontal: 16,
                  },
                  appComponentsDefaultStyles.shadow,
                ]}
              >
                <View className="flex-row w-full justify-between">
                  <CustomText style={{ fontWeight: 600 }}>
                    {item.name}
                  </CustomText>
                  <CustomText>{item.creator}</CustomText>
                </View>
              </CustomButton>
            )}
          />
        )}
        <CustomButton
          style={{
            marginTop: 5,
            borderRadius: 8,
            backgroundColor: appStlye.color_surface_variant,
          }}
        >
          <CustomText style={{ fontWeight: 600 }}>Add New</CustomText>
        </CustomButton>
      </View>
    </View>
  );
};

export default WorkoutProgramsScreen;
