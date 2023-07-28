import { View, Text, FlatList, Image } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import useExplore from "../../hooks/useExplore";
import CustomButton from "../basic/CustomButton";
import CustomText from "../basic/CustomText";
import * as appStyle from "../../utils/appStyleSheet";
import * as firebase from "../../services/firebase";
import useAuth from "../../hooks/useAuth";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import appComponentsDefaultStyles from "../../utils/appComponentsDefaultStyles";
import { convertHexToRgba } from "../../utils/stylingFunctions";
import languageService from "../../services/languageService";
import LoadingAnimation from "../LoadingAnimation";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
const SuggestedUsers = ({ containerColor, onContainerColor }) => {
  const navigation = useNavigation();
  const { suggestedUsers } = useExplore();
  const { user } = useAuth();
  const [sentRequests, setSentRequests] = useState([]);
  const sendFriendRequest = (otherUserId) => {
    const sentRequestsClone = sentRequests.slice();
    sentRequestsClone.push(otherUserId);
    setSentRequests(sentRequestsClone);
    firebase.sendFriendRequest(user.id, otherUserId);
  };
  const listHeight = useSharedValue(0);
  const listAnimatedStyle = useAnimatedStyle(() => {
    return { height: listHeight.value, paddingVertical: listHeight.value / 25 };
  });
  useFocusEffect(
    useCallback(() => {
      if (listHeight.value == 250) return;
      listHeight.value = withTiming(250);
    }, [suggestedUsers])
  );
  // useEffect(() => {

  // }, [suggestedUsers]);
  return (
    <Animated.View
      className="justify-center"
      style={[
        {
          backgroundColor: containerColor,
          rowGap: 5,
        },
        listAnimatedStyle,
      ]}
    >
      <CustomText
        className="text-xl font-semibold"
        style={{
          color: onContainerColor,
          marginHorizontal: 5,
        }}
      >
        {languageService[user.language].suggestedFriends + ":"}
      </CustomText>
      <FlatList
        horizontal
        data={suggestedUsers}
        keyExtractor={(suggestedUser) => suggestedUser.id}
        contentContainerStyle={{
          columnGap: 5,
          marginHorizontal: 5,
          paddingRight: 10,
        }}
        renderItem={({ item }) => (
          <CustomButton
            onPress={() => {
              sentRequests.includes(item.id)
                ? navigation.navigate("Profile", {
                    shownUser: item,
                    friendshipStatus: "SentRequest",
                  })
                : navigation.navigate("Profile", {
                    shownUser: item,
                    friendshipStatus: "None",
                  });
            }}
            className="w-32"
            style={[
              {
                borderColor: appStyle.color_outline,
                borderWidth: 1,
                rowGap: 5,
                backgroundColor: appStyle.color_surface,
              },
              appComponentsDefaultStyles.shadow,
            ]}
          >
            <Image
              className="w-4/5 aspect-square rounded-full"
              source={{ uri: item.img }}
            />
            <View className="flex-1 items-center">
              <CustomText className="font-semibold ">{item.id}</CustomText>
              {item.mutualFriendsCount ? (
                <CustomText
                  style={{
                    color: convertHexToRgba(
                      appStyle.color_on_surface_variant,
                      0.5
                    ),
                  }}
                >
                  {languageService[user.language].mutualFriends +
                    ": " +
                    item.mutualFriendsCount}
                </CustomText>
              ) : (
                item.workoutsCount > 0 && (
                  <CustomText
                    style={{
                      color: convertHexToRgba(
                        appStyle.color_on_surface_variant,
                        0.5
                      ),
                    }}
                  >
                    {languageService[user.language].workouts +
                      ": " +
                      item.workoutsCount}
                  </CustomText>
                )
              )}
            </View>
            {!sentRequests.includes(item.id) ? (
              <CustomButton
                round
                onPress={() => sendFriendRequest(item.id)}
                style={[
                  {
                    backgroundColor: appStyle.color_primary,
                    borderColor: appStyle.color_primary,
                    borderWidth: 1,
                    width: "90%",
                  },
                  appComponentsDefaultStyles.shadow,
                ]}
              >
                <CustomText
                  className="font-semibold"
                  style={{ color: appStyle.color_on_primary }}
                >
                  {languageService[user.language].add}
                </CustomText>
              </CustomButton>
            ) : (
              <CustomButton
                round
                onPress={() => sendFriendRequest(item.id)}
                style={[
                  {
                    borderColor: appStyle.color_outline,
                    borderWidth: 1,
                    width: "90%",
                  },
                ]}
              >
                <CustomText className="font-semibold">
                  {languageService[user.language].added}
                </CustomText>
              </CustomButton>
            )}
          </CustomButton>
        )}
      />
    </Animated.View>
  );
};

export default SuggestedUsers;
