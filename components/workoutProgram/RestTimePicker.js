import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "../basic/CustomButton";
import CustomText from "../basic/CustomText";
import AwesomeModal from "../AwesomeModal";
import CustomTextInput from "../basic/CustomTextInput";
import * as appStyle from "../../utils/appStyleSheet";
const RestTimePicker = (props) => {
  const [showRestModal, setShowRestModal] = useState(false);
  const [restMinutes, setRestMinutes] = useState(props.restSeconds / 60);
  const [restSeconds, setRestSeconds] = useState(props.restSeconds % 60);
  const [minutesFocused, setMinutesFocused] = useState(false);
  const [secondsFocused, setSecondsFocused] = useState(false);
  useEffect(() => {
    props.setRestSeconds(restMinutes * 60 + parseInt(restSeconds));
  }, [restMinutes, restSeconds]);
  const handleMinutesChanged = (text) => {
    if (!minutesFocused) {
      return;
    }
    var validRegex = /(?:[0-5]?[0-9])?/;
    if (text.match(validRegex)) {
      setRestMinutes(String(text));
    } else {
      setRestMinutes("00");
    }
  };
  const handleSecondsChanged = (text) => {
    if (!secondsFocused) return;

    var validRegex = /(?:[0-5]?[0-9])?/;
    if (text.match(validRegex)) {
      setRestSeconds(String(text));
    } else {
      setRestSeconds("00");
    }
  };

  const minutesBlur = () => {
    setMinutesFocused(false);
    setRestMinutes(String(restMinutes).padStart(2, "0"));
  };
  const secondsBlur = () => {
    setSecondsFocused(false);
    setRestSeconds(String(restSeconds).padStart(2, "0"));
  };
  useEffect(() => {
    secondsBlur();
    minutesBlur();
  }, [showRestModal]);
  return (
    <View>
      <CustomButton
        onPress={() => {
          setShowRestModal(true);
        }}
        style={{
          backgroundColor: appStyle.color_surface,
          width: 80,
        }}
      >
        <CustomText>
          {restSeconds != 0 || restMinutes != 0
            ? `${restMinutes}:${restSeconds}`
            : "Choose"}
        </CustomText>
      </CustomButton>
      <AwesomeModal
        onDismiss={() => {
          setShowRestModal(false);
        }}
        onConfirmPressed={() => setShowRestModal(false)}
        setShowModal={setShowRestModal}
        title={"Choose duration"}
        showModal={showRestModal}
        confirmText={"Set"}
        customView={
          <View className="flex-row" style={{ columnGap: 10, height: 50 }}>
            <View>
              <CustomText>minutes</CustomText>
              <View>
                <CustomTextInput
                  style={{ backgroundColor: appStyle.color_surface_variant }}
                  textAlign="center"
                  value={restMinutes}
                  onBlur={minutesBlur}
                  keyboardType="numeric"
                  maxLength={2}
                  onFocus={() => setMinutesFocused(true)}
                  onChangeText={(text) => handleMinutesChanged(text)}
                ></CustomTextInput>
              </View>
            </View>
            <View>
              <CustomText></CustomText>
              <CustomText
                style={{
                  minHeight: 40,
                  fontSize: 20,
                  textAlign: "center",
                  textAlignVertical: "center",
                }}
              >
                :
              </CustomText>
            </View>
            <View>
              <CustomText>seconds</CustomText>
              <View>
                <CustomTextInput
                  style={{ backgroundColor: appStyle.color_surface_variant }}
                  textAlign="center"
                  value={restSeconds}
                  onBlur={secondsBlur}
                  onFocus={() => setSecondsFocused(true)}
                  keyboardType="numeric"
                  maxLength={2}
                  onChangeText={(text) => handleSecondsChanged(text)}
                ></CustomTextInput>
              </View>
            </View>
          </View>
        }
      />
    </View>
  );
};

export default RestTimePicker;
