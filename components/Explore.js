import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useFirebase from "../hooks/useFirebase";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import CustomButton from "./basic/CustomButton";
import * as appStyle from "../utilities/appStyleSheet";
import WorkoutComponent from "./WorkoutComponent";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faRotateRight, faSpinner } from "@fortawesome/free-solid-svg-icons";
import useExplore from "../hooks/useExplore";
import CustomText from "./basic/CustomText";
import languageService from "../services/languageService";

const Explore = () => {
  const { user } = useAuth();
  const { latestWorkouts, refreshLatestWorkouts, refreshing } = useExplore();
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          paddingHorizontal: 16,
          borderBottomColor: appStyle.color_outline,
          borderBottomWidth: 0.5,
        }}
      >
        <CustomButton
          onPress={!refreshing ? refreshLatestWorkouts : () => {}}
          className="self-start my-2 flex-row"
          style={{ backgroundColor: appStyle.color_primary, width: "35%" }}
        >
          <FontAwesomeIcon
            icon={!refreshing ? faRotateRight : faSpinner}
            color={appStyle.color_on_primary}
            size={25}
          />
          <View style={{ width: 10 }} />
          <CustomText style={{ color: appStyle.color_on_primary }}>
            {!refreshing
              ? languageService[user.language].refresh
              : languageService[user.language].loading}
          </CustomText>
        </CustomButton>
      </View>
      <FlatList
        style={[{ paddingHorizontal: 16, paddingVertical: 5 }]}
        data={latestWorkouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <WorkoutComponent workout={item} isPastWorkout={true} />
        )}
      />
    </View>
  );
};

export default Explore;
