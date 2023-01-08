import { TouchableOpacity, Text, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import useAuth from "../hooks/useAuth";
import useAlerts from "../hooks/useAlerts";
import AlertDot from "./AlertDot";
import * as appStyle from "./AppStyleSheet";
const HomeScreenButton = (props) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  return (
    <View>
      {props.spaceHolderButton ? (
        <View className={`items-center justify-center w-36 h-36`}></View>
      ) : (
        <TouchableOpacity
          className={`items-center justify-center rounded-lg w-36 h-36`}
          style={{ backgroundColor: props.style.backgroundColor }}
          onPress={() => navigation.push(props.navigateScreen, { user: user })}
        >
          {props.alert && (
            <View className="absolute left-2 top-2">
              <View
                className="rounded-full"
                style={{
                  backgroundColor: appStyle.color_on_primary,
                  padding: 1,
                }}
              >
                <AlertDot
                  size={35}
                  color={appStyle.color_on_primary}
                  borderColor={appStyle.color_primary}
                  borderWidth={6}
                  number={props.alertNumber}
                  numberColor={appStyle.color_primary}
                />
              </View>
            </View>
          )}
          <FontAwesomeIcon
            icon={props.icon}
            size={props.style.iconSize}
            color={props.style.color}
          />
          <Text
            style={{ color: props.style.color }}
            className="font-bold text-center text-2xl"
          >
            {props.buttonText}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HomeScreenButton;
