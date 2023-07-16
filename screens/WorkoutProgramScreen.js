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
import { faPlay } from "@fortawesome/free-solid-svg-icons";
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
            className="flex-row justify-between items-center"
            style={{
              backgroundColor: appStyle.color_primary_container,
            }}
          >
            <CustomText style={{ fontWeight: 600, fontSize: 30 }}>
              {item.name}
            </CustomText>
            <CustomButton
              style={{ backgroundColor: appStyle.color_on_primary_container }}
            >
              <FontAwesomeIcon
                icon={faPlay}
                color={appStyle.color_background}
              />
            </CustomButton>
          </CustomButton>
        )}
      />
    </View>
  );
};

export default WorkoutProgramScreen;
