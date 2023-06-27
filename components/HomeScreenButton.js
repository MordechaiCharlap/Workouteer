import { Text, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import useAuth from "../hooks/useAuth";
import AlertDot from "./AlertDot";
import * as appStyle from "../utils/appStyleSheet";
import CustomButton from "./basic/CustomButton";
import CustomText from "./basic/CustomText";
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
          style={{
            backgroundColor: props.style.backgroundColor,
            width: props.style.size,
            height: props.style.size,
            borderRadius: 10,
            borderWidth: 0.5,
            borderColor: appStyle.color_outline,
          }}
          onPress={() =>
            navigation.navigate(props.navigateScreen, { user: user })
          }
        >
          {props.alert && (
            <View className="absolute left-2 top-2">
              <AlertDot
                size={26}
                text={props.alertNumber}
                textColor={appStyle.color_on_primary}
                color={appStyle.color_primary}
              />
            </View>
          )}
          {/* {props.number && (
            <View className="absolute left-2 top-2" style={{ width: "30%" }}>
              <AlertDot
                size={26}
                text={props.number < 100 ? props.number : "99+"}
                textColor={appStyle.color_on_primary}
                color={appStyle.color_primary}
              />
              {!props.alert && (
                <View className="absolute left-0 bottom-0">
                  <AlertDot
                    size={10}
                    color={appStyle.color_error}
                    borderWidth={1}
                    borderColor={props.style.backgroundColor}
                  />
                </View>
              )}
            </View>
          )} */}
          <FontAwesomeIcon
            icon={props.icon}
            size={props.style.iconSize}
            color={props.style.iconColor}
          />
          <Text
            style={{
              color: props.style.textColor,
              fontSize: props.style.fontSize,
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            {props.buttonText}
          </Text>
        </CustomButton>
      )}
    </View>
  );
};

export default HomeScreenButton;
