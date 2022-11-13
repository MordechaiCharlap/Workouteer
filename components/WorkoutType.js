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
  const isWeb = Platform.OS == "web";
  const [chosenType, setChosenType] = useState(0);
  const getBackgroundColor = (id) => {
    if (chosenType == id) return appStyle.appDarkBlue;
    return appStyle.appLightBlue;
  };
  const getTextColor = (id) => {
    if (chosenType == id) return "white";
    return appStyle.appDarkBlue;
  };
  const typeClicked = (id) => {
    props.typeSelected(id);
    setChosenType(id);
  };
  return (
    <View className="h-80">
      <View className="flex-row justify-around mb-10">
        <TouchableOpacity
          onPress={() => {
            typeClicked(1);
          }}
        >
          <View
            style={{ backgroundColor: getBackgroundColor(1) }}
            className={`w-28 h-28 p-4 items-center m-1 rounded-lg shadow-lg `}
          >
            <FontAwesomeIcon
              color={getTextColor(1)}
              icon={faDumbbell}
              size={60}
            />
            <Text style={{ textAlign: "center", color: getTextColor(1) }}>
              Resistance Training
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            typeClicked(2);
          }}
        >
          <View
            style={{ backgroundColor: getBackgroundColor(2) }}
            className={`w-28 h-28 p-4 items-center m-1 rounded-lg shadow-lg `}
          >
            <FontAwesomeIcon
              color={getTextColor(2)}
              icon={faPersonWalking}
              size={60}
            />
            <Text style={{ textAlign: "center", color: getTextColor(2) }}>
              Walking
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-around">
        <TouchableOpacity
          onPress={() => {
            typeClicked(3);
          }}
        >
          <View
            style={{ backgroundColor: getBackgroundColor(3) }}
            className={`w-28 h-28 p-4 items-center m-1 rounded-lg shadow-lg `}
          >
            <FontAwesomeIcon
              color={getTextColor(3)}
              icon={faPersonRunning}
              size={60}
            />
            <Text style={{ textAlign: "center", color: getTextColor(3) }}>
              Running
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            typeClicked(4);
          }}
        >
          <View
            style={{ backgroundColor: getBackgroundColor(4) }}
            className={`w-28 h-28 p-4 items-center m-1 rounded-lg shadow-lg `}
          >
            <FontAwesomeIcon
              color={getTextColor(4)}
              icon={faPersonBiking}
              size={60}
            />
            <Text style={{ textAlign: "center", color: getTextColor(4) }}>
              Biking
            </Text>
          </View>
        </TouchableOpacity>
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
