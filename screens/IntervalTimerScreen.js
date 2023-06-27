import { View, Text } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import CustomButton from "../components/basic/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlayCircle } from "@fortawesome/free-solid-svg-icons";
import * as appStlye from "../utils/appStyleSheet";
import DropDownPicker from "react-native-dropdown-picker";
const IntervalTimerScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  const [hoursOpen, setHoursOpen] = useState(false);
  const [hours, setHours] = useState([]);
  const [hour, setHour] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("IntervalTimer");
    }, [])
  );
  useEffect(() => {
    setHours([
      { label: "test1", value: 1 },
      { label: "test2", value: 2 },
      { label: "test3", value: 3 },
      { label: "test4", value: 4 },
      { label: "test5", value: 5 },
      { label: "test6", value: 6 },
      { label: "test7", value: 7 },
      { label: "test8", value: 8 },
    ]);
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: appStlye.color_primary }}>
      <CustomButton>
        <FontAwesomeIcon
          icon={faPlayCircle}
          color={appStlye.color_on_background}
          size={40}
        />
      </CustomButton>
      <DropDownPicker
        style={{}}
        open={hoursOpen}
        value={hour}
        items={hours}
        setOpen={setHoursOpen}
        setValue={setHour}
        setItems={setHours}
      />
    </View>
  );
};

export default IntervalTimerScreen;
