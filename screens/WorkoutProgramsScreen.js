import { View, Text, FlatList, StyleSheet, ScrollView } from "react-native";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as appStyle from "../utils/appStyleSheet";
import CustomText from "../components/basic/CustomText";
import CustomButton from "../components/basic/CustomButton";
import { safeAreaStyle } from "../components/safeAreaStyle";
import Header from "../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faMagnifyingGlass,
  faPen,
  faPlusCircle,
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
      <Header goBackOption={true} />
      <View>
        <ScrollView horizontal={true} style={{ marginLeft: 16 }}>
          <TopButton
            icon={faPlusCircle}
            text={"Create new"}
            onPress={() => navigation.navigate("IntervalTimer")}
          />
          <View style={{ width: 5 }} />
          <TopButton
            icon={faMagnifyingGlass}
            text={"Search Programs"}
            onPress={() => navigation.navigate("IntervalTimer")}
          />
          <View style={{ width: 5 }} />

          <TopButton
            icon={faStopwatch}
            text={"Interval Timer"}
            onPress={() => navigation.navigate("IntervalTimer")}
          />
        </ScrollView>
      </View>
      <View style={{ height: 10 }} />
      <View>
        <View className="flex-row justify-between">
          <CustomText style={{ fontWeight: 600, fontSize: 30 }}>
            Saved Programs
          </CustomText>
          <CustomButton>
            <FontAwesomeIcon
              icon={faPen}
              size={15}
              color={appStyle.color_on_background}
            />
          </CustomButton>
        </View>

        {savedWorkoutPrograms && savedWorkoutPrograms.length > 0 && (
          <FlatList
            data={savedWorkoutPrograms}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CustomButton
                style={[
                  {
                    backgroundColor: appStyle.color_surface_variant,
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
        {/* <CustomButton
          style={{
            marginTop: 5,
            borderRadius: 8,
            backgroundColor: appStyle.color_surface_variant,
          }}
        >
          <CustomText style={{ fontWeight: 600 }}>Add New</CustomText>
        </CustomButton> */}
      </View>
    </View>
  );
};

export default WorkoutProgramsScreen;
const TopButton = ({ onPress, icon, text }) => {
  return (
    <CustomButton
      className="flex-row rounded-xl"
      onPress={onPress}
      style={{
        backgroundColor: appStyle.color_surface_variant,
      }}
    >
      <FontAwesomeIcon
        icon={icon}
        size={15}
        color={appStyle.color_on_background}
      />
      <CustomText
        style={{ color: appStyle.color_on_background, marginLeft: 3 }}
      >
        {text}
      </CustomText>
    </CustomButton>
  );
};
