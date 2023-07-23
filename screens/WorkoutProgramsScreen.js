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
  faCheck,
  faCheckCircle,
  faChevronCircleLeft,
  faMinusCircle,
  faPen,
  faPlusCircle,
  faStopwatch,
} from "@fortawesome/free-solid-svg-icons";
import useAuth from "../hooks/useAuth";
import {
  doc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  arrayRemove,
  increment,
  query,
  where,
} from "firebase/firestore";

import useFirebase from "../hooks/useFirebase";
import appComponentsDefaultStyles from "../utils/appComponentsDefaultStyles";
import languageService from "../services/languageService";
const WorkoutProgramsScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { db } = useFirebase();
  const [editingSavedPrograms, setEditingSavedPrograms] = useState(false);
  const [savedPrograms, setSavedPrograms] = useState();
  const [removingProgram, setRemovingProgram] = useState();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("WorkoutPrograms");
    }, [])
  );
  useEffect(() => {
    if (user.savedWorkoutPrograms.length == 0) return;
    const savedProgramsQuery = query(
      collection(db, "workoutPrograms"),
      where("__name__", "in", user.savedWorkoutPrograms)
    );
    getDocs(savedProgramsQuery).then((querySnapshot) => {
      const programs = [];
      querySnapshot.forEach((doc) => {
        programs.push({ ...doc.data(), id: doc.id });
      });

      setSavedPrograms(programs);
    });
  }, [user.savedWorkoutPrograms]);
  const removeProgram = (index) => {
    const programId = savedPrograms[index].id;
    const creatorId = savedPrograms[index].creator;
    const savedProgramsClone = savedPrograms.slice();
    savedProgramsClone.splice(index, 1);
    setSavedPrograms(savedProgramsClone);
    //An option for a creator that deletes the program for every user using array contains
    if (savedPrograms[index].creator == creatorId) {
      const q = query(
        collection(db, "users"),
        where("savedWorkoutPrograms", "array-contains", programId)
      );
      getDocs(q).then((snapshot) =>
        snapshot.forEach((document) => {
          updateDoc(doc(db, "users", document.id), {
            savedWorkoutPrograms: arrayRemove(programId),
          });
        })
      );
      deleteDoc(doc(db, "workoutPrograms", programId));
    } else {
      //an option for non user, just decrement the currentUsersCount by 1 and remove from saved
      updateDoc(doc(db, "workoutPrograms", programId), {
        currentUsersCount: increment(-1),
      });
      updateDoc(doc(db, "users", user.id), {
        savedWorkoutPrograms: arrayRemove(programId),
      });
    }
  };
  return (
    <View style={safeAreaStyle()}>
      <Header
        goBackOption={true}
        title={languageService[user.language].workoutPrograms}
      />
      <View>
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          style={{ marginLeft: 16 }}
          contentContainerStyle={{ columnGap: 5 }}
        >
          <TopButton
            icon={faPlusCircle}
            text={languageService[user.language].buildProgram}
            onPress={() => navigation.navigate("CreateWorkoutProgram")}
          />
          {/* <TopButton
            icon={faMagnifyingGlass}
            text={languageService[user.language].search}
            onPress={() => {}}
          /> */}
          <TopButton
            icon={faStopwatch}
            text={languageService[user.language].timer}
            onPress={() => navigation.navigate("IntervalTimer")}
          />
        </ScrollView>
      </View>
      <View style={{ height: 10 }} />
      <View
        className="flex-row justify-between"
        style={{ paddingHorizontal: 16 }}
      >
        <CustomText style={{ fontWeight: 600, fontSize: 30 }}>
          {languageService[user.language].savedPrograms}
        </CustomText>
        {savedPrograms && savedPrograms.length > 0 && (
          <CustomButton
            onPress={() => {
              if (removingProgram) setRemovingProgram();
              setEditingSavedPrograms((prev) => !prev);
            }}
          >
            <FontAwesomeIcon
              icon={!editingSavedPrograms ? faPen : faCheck}
              size={15}
              color={appStyle.color_on_background}
            />
          </CustomButton>
        )}
      </View>

      {savedPrograms && savedPrograms.length > 0 && (
        <FlatList
          contentContainerStyle={{ rowGap: 10 }}
          data={savedPrograms}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <CustomButton
              onLongPress={() => {
                if (!editingSavedPrograms) setEditingSavedPrograms(true);
              }}
              onPress={() => {
                if (editingSavedPrograms) return;
                if (removingProgram) setRemovingProgram();
                if (editingSavedPrograms) setEditingSavedPrograms();
                navigation.navigate("WorkoutProgram", { program: item });
              }}
              style={[
                {
                  backgroundColor: appStyle.color_surface_variant,
                  borderRadius: 4,
                  padding: 0,
                  margin: 16,
                },
                appComponentsDefaultStyles.shadow,
              ]}
            >
              <View
                className="flex-row w-full justify-between"
                style={{
                  paddingVertical: 20,
                  paddingHorizontal: 16,
                }}
              >
                <CustomText style={{ fontWeight: 600 }}>{item.name}</CustomText>
                {editingSavedPrograms && (
                  <View className="absolute top-0 bottom-0 right-2 items-center justify-center">
                    {removingProgram != item.id ? (
                      <CustomButton
                        onPress={() => {
                          setRemovingProgram(item.id);
                        }}
                        className="rounded-full"
                        style={{
                          padding: 0,
                          borderWidth: 2,
                          backgroundColor: appStyle.color_background,
                          borderColor: appStyle.color_surface_variant,
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faMinusCircle}
                          color={appStyle.color_error}
                          size={30}
                        />
                      </CustomButton>
                    ) : (
                      <View className="flex-row">
                        <CustomButton
                          onPress={() => {
                            setRemovingProgram();
                          }}
                          className="rounded-full"
                          style={{
                            padding: 0,
                            borderWidth: 2,
                            backgroundColor: appStyle.color_background,
                            borderColor: appStyle.color_surface_variant,
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faChevronCircleLeft}
                            color={appStyle.color_error}
                            size={30}
                          />
                        </CustomButton>
                        <CustomButton
                          onPress={() => {
                            setRemovingProgram();
                            removeProgram(index);
                            setEditingSavedPrograms(false);
                          }}
                          className="rounded-full"
                          style={{
                            padding: 0,
                            borderWidth: 2,
                            backgroundColor: appStyle.color_background,
                            borderColor: appStyle.color_surface_variant,
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            color={appStyle.color_success}
                            size={30}
                          />
                        </CustomButton>
                      </View>
                    )}
                  </View>
                )}
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
          <CustomText style={{ fontWeight: 600 }}>{languageService[user.language].addNewProgram}</CustomText>
        </CustomButton> */}
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
