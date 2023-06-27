import { View, Text } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import CustomButton from "../components/basic/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import * as appStlye from "../utils/appStyleSheet";
import { collection, doc, onSnapshot } from "firebase/firestore";
import useFirebase from "../hooks/useFirebase";
const IntervalTimerScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  const listenerSubscriber = useRef();
  const { db } = useFirebase();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("IntervalTimer");
    }, [])
  );
  const stopListen = () => {
    if (listenerSubscriber) {
      console.log("stop listen");
      listenerSubscriber.current();
      listenerSubscriber.current = null;
    }
  };
  useEffect(() => {
    return () => stopListen();
  }, []);
  const startListen = async () => {
    listenerSubscriber.current = onSnapshot(
      doc(db, "test/testListen"),
      (doc) => {
        if (doc.exists()) {
          console.log("exists");
          console.log(doc.data());
        } else {
          console.log("not exists yet");
        }
      }
    );
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: appStlye.color_primary,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CustomButton onPress={startListen}>
        <FontAwesomeIcon
          icon={faPlayCircle}
          color={appStlye.color_on_background}
          size={40}
        />
      </CustomButton>
    </View>
  );
};

export default IntervalTimerScreen;
