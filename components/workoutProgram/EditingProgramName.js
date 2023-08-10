import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import * as appStyle from "../../utils/appStyleSheet";
import CustomText from "../basic/CustomText";
import languageService from "../../services/languageService";
import CustomTextInput from "../basic/CustomTextInput";
import CustomButton from "../basic/CustomButton";
import { useNavigation } from "@react-navigation/native";
import appComponentsDefaultStyles from "../../utils/appComponentsDefaultStyles";
const EditingProgramName = ({ setShowModal }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [highlightErrorInput, setHighlightErrorInput] = useState(false);
  useEffect(() => {
    if (name.length >= 5 && highlightErrorInput) setHighlightErrorInput(false);
  }, [name]);
  return (
    <View style={{ rowGap: 10 }}>
      <CustomText className="text-xl font-semibold">
        {
          languageService[user.language].howDoYouWantToCallYourWorkoutProgram[
            user.isMale ? 1 : 0
          ]
        }
      </CustomText>
      <CustomText>
        {
          languageService[user.language].rememberThisCantBeChangedLater[
            user.isMale ? 1 : 0
          ]
        }
      </CustomText>
      <CustomTextInput
        style={[
          highlightErrorInput && appComponentsDefaultStyles.errorInput,
          {
            backgroundColor: appStyle.color_surface_variant,
            flex: 0,
          },
        ]}
        textAlign={user.language == "hebrew" ? "right" : "left"}
        value={name}
        placeholder={
          languageService[user.language].name +
          ", " +
          languageService[user.language].atLeast5Chars
        }
        onChangeText={(text) => setName(text)}
      />
      <CustomButton
        round
        onPress={() => {
          if (name.length >= 5) {
            setShowModal(false);
            navigation.navigate("CreateWorkoutProgram", {
              programName: name,
            });
          } else {
            setHighlightErrorInput(true);
          }
        }}
        style={{ backgroundColor: appStyle.color_on_surface }}
      >
        <CustomText
          className="font-semibold tracking-wider"
          style={{ color: appStyle.color_surface }}
        >
          {languageService[user.language].continue[user.isMale ? 1 : 0]}
        </CustomText>
      </CustomButton>
    </View>
  );
};

export default EditingProgramName;
