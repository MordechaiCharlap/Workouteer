import { View } from "react-native";
import React from "react";
import { leagues } from "../../utilities/defaultValues";
import * as appStyle from "../../utilities/appStyleSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
const CurrentLeague = ({ league }) => {
  return (
    <View className="flex-row">
      {leagues.map((leagueName, index) => {
        return (
          <View
            key={leagueName}
            style={{
              width: 1,
              flexGrow: 1,
              aspectRatio: 1,
              padding: 3,
            }}
          >
            <View
              style={{
                borderRadius: 6,
                borderWidth: 2,
                borderColor: appStyle.color_outline,
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor:
                  index == league
                    ? appStyle.color_tertiary
                    : index < league
                    ? appStyle.color_success
                    : appStyle.color_error,
              }}
            >
              {!(index > league) &&
                (index == league ? (
                  <View
                    style={{
                      borderRadius: 9999,
                      height: "50%",
                      width: "50%",
                      backgroundColor: appStyle.color_background,
                    }}
                  ></View>
                ) : (
                  <FontAwesomeIcon
                    icon={faCheck}
                    color={appStyle.color_background}
                  />
                ))}
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default CurrentLeague;
