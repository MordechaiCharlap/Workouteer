import { TouchableOpacity, Text, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import useAuth from "../hooks/useAuth";
import useAlerts from "../hooks/useAlerts";
import AlertDot from "./AlertDot";
import * as appStyle from "../utilities/appStyleSheet";
import CustomButton from "./basic/CustomButton";
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
          type={"primary"}
          style={{
            width: props.style.size,
            height: props.style.size,
            borderRadius: 10,
          }}
          onPress={() =>
            navigation.navigate(props.navigateScreen, { user: user })
          }
        >
          {props.alert && (
            <View className="absolute left-3 top-3">
              <AlertDot
                size={26}
                color={appStyle.color_on_primary}
                borderColor={appStyle.color_primary}
                text={props.alertNumber}
                textColor={appStyle.color_primary}
              />
            </View>
          )}
          <FontAwesomeIcon
            icon={props.icon}
            size={props.style.iconSize}
            color={props.style.color}
          />
          <Text
            style={{
              color: props.style.color,
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
