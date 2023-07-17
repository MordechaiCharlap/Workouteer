import { View, Text, FlatList, TouchableOpacity } from "react-native";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as appStyle from "../utils/appStyleSheet";
import CustomText from "../components/basic/CustomText";
import CustomButton from "../components/basic/CustomButton";
import { safeAreaStyle } from "../components/safeAreaStyle";
import useAuth from "../hooks/useAuth";
import useFirebase from "../hooks/useFirebase";
import Header from "../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPen, faPlay } from "@fortawesome/free-solid-svg-icons";
import appComponentsDefaultStyles from "../utils/appComponentsDefaultStyles";
const WorkoutProgramScreen = ({ route }) => {
  const { setCurrentScreen } = useNavbarDisplay();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { db } = useFirebase();
  const program = route.params.program;
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("WorkoutProgram");
    }, [])
  );
  return (
    <View style={safeAreaStyle()}>
      <Header goBackOption={true} icon={"<"} title={program.name} />
      <FlatList
        keyExtractor={(item, index) => index}
        data={program.workouts}
        style={{ marginHorizontal: 16 }}
        renderItem={({ item }) => (
          <CustomButton
            style={{
              marginBottom: 10,
              backgroundColor: appStyle.color_primary_container,
            }}
          >
            <View className="flex-row w-full justify-between items-center">
              <CustomText
                style={{
                  fontWeight: 600,
                  fontSize: 30,
                  color: appStyle.color_on_background,
                }}
              >
                {item.name}
              </CustomText>
              <View className="flex-row">
                {program.creator == user.id && (
                  <CustomButton
                    style={{
                      marginRight: 5,
                      backgroundColor: appStyle.color_primary,
                      borderWidth: 2,
                      borderColor: appStyle.color_background,
                      borderRadius: 12,
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faPen}
                      color={appStyle.color_background}
                    />
                  </CustomButton>
                )}
                <CustomButton
                  style={{
                    backgroundColor: appStyle.color_primary,
                    borderWidth: 2,
                    borderColor: appStyle.color_background,
                    borderRadius: 12,
                  }}
                >
                  <FontAwesomeIcon
                    icon={faPlay}
                    color={appStyle.color_background}
                  />
                </CustomButton>
              </View>
            </View>
            <FlatList
              className="w-full mt-1"
              data={item.exercises}
              keyExtractor={(exercise, index) => index}
              renderItem={({ item }) => (
                <Text style={{ fontSize: 15 }}>
                  {item.sets} sets of {item.reps} {item.name}
                </Text>
              )}
            />
          </CustomButton>
        )}
      />
    </View>
  );
};

export default WorkoutProgramScreen;
