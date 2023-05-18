import { View, Text, StyleSheet, Alert } from "react-native";
import { React, useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import languageService from "../services/languageService";
import * as appStyle from "../utilities/appStyleSheet";
import useAuth from "../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faStopwatch } from "@fortawesome/free-solid-svg-icons";
import appComponentsDefaultStyles from "../utilities/appComponentsDefaultStyles";
const data = [
  { label: "0:30", value: 30 },
  { label: "1:00", value: 60 },
  { label: "1:30", value: 90 },
  { label: "2:00", value: 120 },
  { label: "2:30", value: 150 },
  { label: "3:00", value: 180 },
];

const WorkoutMinutes = ({ value, minutesSelected, color }) => {
  const { user } = useAuth();
  const [minutes, setMinutes] = useState(value);
  const [isFocus, setIsFocus] = useState(false);
  useEffect(() => {
    minutesSelected(minutes);
  }, [minutes]);
  const handleMinutesChange = (item) => {
    setMinutes(item.value);
    setIsFocus(false);
  };
  return (
    <View
      className={`flex-1 items-center flex-row${
        user.language == "hebrew" && "-reverse"
      }`}
    >
      <FontAwesomeIcon icon={faStopwatch} color={color} size={30} />
      <View style={{ width: 10 }}></View>
      <Dropdown
        style={[
          minutes
            ? appComponentsDefaultStyles.input
            : appComponentsDefaultStyles.errorInput,
          { flex: 1 },
        ]}
        placeholderStyle={[
          appComponentsDefaultStyles.textOnInput,
          { textAlign: "center" },
        ]}
        selectedTextStyle={[
          appComponentsDefaultStyles.textOnInput,
          { textAlign: "center" },
        ]}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={
          !isFocus
            ? languageService[user.language].choose[user.isMale ? 1 : 0]
            : "..."
        }
        value={minutes}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          handleMinutesChange(item);
        }}
      />
    </View>
  );
};

export default WorkoutMinutes;

const styles = StyleSheet.create({
  dropdown: {
    flex: 1,
    height: 50,
    borderColor: appStyle.color_primary,
    borderWidth: 0.5,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
  valueNotChanged: {
    backgroundColor: appStyle.color_background_variant,
  },
  valueChanged: {
    backgroundColor: appStyle.color_primary,
  },
  icon: {
    marginRight: 5,
    color: "white",
  },
  label: {
    position: "absolute",
    color: appComponentsDefaultStyles.textOnInput,
    backgroundColor: appStyle.color_primary,
    left: 22,
    top: -10,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
