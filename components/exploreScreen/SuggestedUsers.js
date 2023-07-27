import { View, Text, FlatList, Image } from "react-native";
import React from "react";
import useExplore from "../../hooks/useExplore";
import CustomButton from "../basic/CustomButton";
import CustomText from "../basic/CustomText";

const SuggestedUsers = () => {
  const { SuggestedUsers } = useExplore();
  return (
    <View>
      <FlatList
        horizontal
        data={SuggestedUsers}
        keyExtractor={(suggestedUser) => suggestedUser.id}
        renderItem={({ item }) => (
          <CustomButton>
            <Image
              className="w-5 h-5 rounded-full"
              source={{ uri: item.img }}
            />
            <CustomText>{item.id}</CustomText>
            {item.mutualFriendsCount != null && (
              <CustomText>Mutual friends: {item.mutualFriendsCount}</CustomText>
            )}
          </CustomButton>
        )}
      />
    </View>
  );
};

export default SuggestedUsers;
