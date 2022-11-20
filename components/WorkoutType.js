import { View, Text, FlatList, TouchableOpacity, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import * as appStyle from "./AppStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faDumbbell } from "@fortawesome/free-solid-svg-icons";
import { faPersonWalking } from "@fortawesome/free-solid-svg-icons";
import { faPersonRunning } from "@fortawesome/free-solid-svg-icons";
import { faPersonBiking } from "@fortawesome/free-solid-svg-icons";

const workoutTypes = [
  {
    id: 1,
    title: "Resistance Training",
    icon: faDumbbell,
  },
  {
    id: 2,
    title: "Walking",
    icon: faPersonWalking,
  },
  {
    id: 3,
    title: "Running",
    icon: faPersonRunning,
  },
  {
    id: 4,
    title: "Biking",
    icon: faPersonBiking,
  },
];

const WorkoutType = (props) => {
  const iconSize = 60;
  const isWeb = Platform.OS == "web";
  const [chosenType, setChosenType] = useState(0);
  const typeClicked = (id) => {
    props.typeSelected(id);
    setChosenType(id);
  };
  const renderWorkoutTypeButton = (type) => {
    return (
      <TouchableOpacity
        onPress={() => {
          typeClicked(type.id);
        }}
        className="mb-5 rounded-lg"
        style={{
          width: "47%",
          borderWidth: 1,
          borderColor:
            type.id == chosenType ? appStyle.appGray : appStyle.appDarkBlue,
        }}
      >
        <View
          style={{
            backgroundColor:
              type.id == chosenType
                ? appStyle.appDarkBlue
                : appStyle.appLightBlue,
          }}
          className={`p-4 items-center rounded-lg`}
        >
          <FontAwesomeIcon
            color={
              type.id == chosenType ? appStyle.appGray : appStyle.appDarkBlue
            }
            icon={type.icon}
            size={iconSize}
          />
          <Text
            className="text-center"
            style={{
              color:
                type.id == chosenType ? appStyle.appGray : appStyle.appDarkBlue,
            }}
          >
            {type.title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View>
      <View className="flex-row flex-wrap justify-between">
        {renderWorkoutTypeButton(workoutTypes[0])}
        {renderWorkoutTypeButton(workoutTypes[1])}
        {renderWorkoutTypeButton(workoutTypes[2])}
        {renderWorkoutTypeButton(workoutTypes[3])}
      </View>
    </View>
  );
  // return (
  //   <View className="h-40">
  //     <FlatList
  //       showsHorizontalScrollIndicator={isWeb}
  //       className="w-auto rounded-lg"
  //       initialScrollIndex={0.8}
  //       data={workoutTypes}
  //       keyExtractor={(item) => item.id}
  //       horizontal
  //       renderItem={({ item }) => (
  //         <TouchableOpacity
  //           onPress={() => {
  //             typeClicked(item.id);
  //           }}
  //         >
  //           <View
  //             style={{ backgroundColor: getBackgroundColor(item.id) }}
  //             className={`w-28 h-28 p-4 items-center m-1 rounded-lg shadow-lg `}
  //           >
  //             <FontAwesomeIcon
  //               color={getTextColor(item.id)}
  //               icon={item.icon}
  //               size={60}
  //             />
  //             <Text
  //               style={{ textAlign: "center", color: getTextColor(item.id) }}
  //             >
  //               {item.title}
  //             </Text>
  //           </View>
  //         </TouchableOpacity>
  //       )}
  //     />
  //   </View>
  // );
};

export default WorkoutType;
