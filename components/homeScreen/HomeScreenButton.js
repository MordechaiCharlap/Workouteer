import { Text, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import useAuth from "../../hooks/useAuth";
import AlertDot from "../AlertDot";
import * as appStyle from "../../utils/appStyleSheet";
import CustomButton from "../basic/CustomButton";
import CustomText from "../basic/CustomText";
import appComponentsDefaultStyles from "../../utils/appComponentsDefaultStyles";
const HomeScreenButton = (props) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  return (
    <View>
      {props.spaceHolderButton ? (
        <View
          className={`items-center justify-center`}
          style={{ width: props.style.size, height: props.style.size }}
        ></View>
      ) : (
        <CustomButton
          style={[
            {
              backgroundColor: props.style.backgroundColor,
              width: props.style.size,
              height: props.style.size,
              borderRadius: 10,
              borderWidth: 0.5,
              borderColor: appStyle.color_outline,
            },
            appComponentsDefaultStyles.shadow,
          ]}
          onPress={() =>
            navigation.navigate(props.navigateScreen, { user: user })
          }
        >
          {props.number != null && props.number != 0 && props.number != "0" ? (
            <View className="absolute left-2 top-2">
              <AlertDot
                size={26}
                text={props.number}
                textColor={appStyle.color_on_primary}
                color={appStyle.color_primary}
              />
              {props.alert && (
                <View className="absolute right-0 bottom-0">
                  <AlertDot
                    size={10}
                    color={appStyle.color_error}
                    borderColor={props.style.backgroundColor}
                    borderWidth={1.5}
                  />
                </View>
              )}
            </View>
          ) : (
            props.alert && (
              <View className="absolute left-2 top-2">
                <AlertDot
                  size={26}
                  text={props.alertNumber}
                  textColor={appStyle.color_on_primary}
                  color={appStyle.color_primary}
                />
              </View>
            )
          )}

          <FontAwesomeIcon
            icon={props.icon}
            size={props.style.iconSize}
            color={props.style.iconColor}
          />
          <CustomText
            style={{
              color: props.style.textColor,
              fontSize: props.style.fontSize,
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            {props.buttonText}
          </CustomText>
        </CustomButton>
      )}
    </View>
  );
};

export default HomeScreenButton;
