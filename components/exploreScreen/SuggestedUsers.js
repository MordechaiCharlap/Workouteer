import { View, Text, FlatList, Image } from "react-native";
import React, { useState } from "react";
import useExplore from "../../hooks/useExplore";
import CustomButton from "../basic/CustomButton";
import CustomText from "../basic/CustomText";
import * as appStyle from "../../utils/appStyleSheet";
import * as firebase from "../../services/firebase";
import useAuth from "../../hooks/useAuth";
import { useNavigation } from "@react-navigation/native";
import appComponentsDefaultStyles from "../../utils/appComponentsDefaultStyles";
const SuggestedUsers = ({ containerColor, onContainerColor }) => {
  const navigation = useNavigation();
  const { SuggestedUsers } = useExplore();
  const { user } = useAuth();
  const [sentRequests, setSentRequests] = useState([]);
  const sendFriendRequest = (otherUserId) => {
    const sentRequestsClone = sentRequests.slice();
    sentRequestsClone.push(otherUserId);
    setSentRequests(sentRequestsClone);
    firebase.sendFriendRequest(user.id, otherUserId);
  };
  return (
    <View
      style={{
        backgroundColor: containerColor,
        marginTop: 16,
        paddingVertical: 10,
        rowGap: 5,
      }}
    >
      <CustomText
        className="text-xl font-semibold"
        style={{ color: onContainerColor, marginHorizontal: 5 }}
      >
        Suggested friends for you:
      </CustomText>
      <FlatList
        horizontal
        data={SuggestedUsers}
        keyExtractor={(suggestedUser) => suggestedUser.id}
        contentContainerStyle={{
          columnGap: 5,
          marginHorizontal: 5,
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
            className="justify-start w-32"
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
            <CustomText className="font-semibold ">{item.id}</CustomText>
            {item.mutualFriendsCount != null && (
              <CustomText>Mutual friends: {item.mutualFriendsCount}</CustomText>
            )}
            <CustomButton
              onPress={() => sendFriendRequest(item.id)}
              style={{ backgroundColor: appStyle.color_primary, width: "90%" }}
            >
              <CustomText style={{ color: appStyle.color_on_primary }}>
                Add
              </CustomText>
            </CustomButton>
          </CustomButton>
        )}
      />
    </View>
  );
};

export default SuggestedUsers;
