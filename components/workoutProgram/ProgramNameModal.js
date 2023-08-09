import { View, Text } from "react-native";
import React, { useState } from "react";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import useAuth from "../../hooks/useAuth";
import appComponentsDefaultStyles from "../../utils/appComponentsDefaultStyles";
import * as appStyle from "../../utils/appStyleSheet";
import CustomText from "../basic/CustomText";
import languageService from "../../services/languageService";
import CustomTextInput from "../basic/CustomTextInput";
import CustomButton from "../basic/CustomButton";
import { useNavigation } from "@react-navigation/native";

const ProgramNameModal = ({
  showProgramNameModal,
  setShowProgramNameModal,
}) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [name, setName] = useState("");
  return (
    showProgramNameModal && (
      <View className="h-full w-full absolute justify-center items-center">
        <View
          className="absolute w-full h-full"
          style={{ backgroundColor: "black", opacity: 0.3 }}
        ></View>
        <Animated.View
          entering={FadeInDown.easing()}
          style={[
            {
              borderWidth: 0.5,
              borderColor: appStyle.color_outline,
              backgroundColor: appStyle.color_surface,
              borderRadius: 16,
              padding: 8,
              rowGap: 5,
            },
            appComponentsDefaultStyles.shadow,
          ]}
        >
          <CustomText className="text-xl font-semibold">
            {
              languageService[user.language]
                .howDoYouWantToCallYourWorkoutProgram[user.isMale ? 1 : 0]
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
            style={{ backgroundColor: appStyle.color_surface_variant, flex: 0 }}
            textAlign={user.language == "hebrew" ? "right" : "left"}
            value={name}
            placeholder={languageService[user.language].name}
            onChangeText={(text) => setName(text)}
          />
          <CustomButton
            onPress={() =>
              navigation.navigate("CreateWorkoutProgram", { programName: name })
            }
            style={{ backgroundColor: appStyle.color_primary }}
          >
            <CustomText style={{ color: appStyle.color_on_primary }}>
              {languageService[user.language].continue[user.isMale ? 1 : 0]}
            </CustomText>
          </CustomButton>
        </Animated.View>
      </View>
    )
  );
};

export default ProgramNameModal;
