import { View, Text } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import Header from "../../components/Header";
import useFirebase from "../../hooks/useFirebase";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import SuggestionHeader from "../../components/suggestionsAndBugsScreen/SuggestionHeader";
import CustomText from "../../components/basic/CustomText";
import * as appStyle from "../../utils/appStyleSheet";
import appComponentsDefaultStyles from "../../utils/appComponentsDefaultStyles";
import CustomButton from "../../components/basic/CustomButton";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  checkFriendShipStatus,
  getUserDataById,
} from "../../services/firebase";
import useAuth from "../../hooks/useAuth";
import useNavbarDisplay from "../../hooks/useNavbarDisplay";

const SuggestionsAndBugsScreen = () => {
  const navigation = useNavigation();
  const { setCurrentScreen } = useNavbarDisplay();
  const { db } = useFirebase();
  const { user } = useAuth();
  const listOpacity = useSharedValue(0);
  const listMarginTop = useSharedValue(25);
  const animatedListStyle = useAnimatedStyle(() => {
    return {
      opacity: listOpacity.value,
      marginTop: listMarginTop.value,
    };
  }, []);
  const [list, setList] = useState([]);
  const [maximizedIndex, setMaximizedIndex] = useState();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("SuggestionsAndBugs");
    }, [])
  );
  useEffect(() => {
    const suggestionsQuery = query(
      collection(db, "suggestions"),
      orderBy("dateSubmitted")
    );
    const observer = onSnapshot(suggestionsQuery, (suggestionSnapshot) => {
      suggestionSnapshot.docChanges().forEach((change) => {
        if (change.type == "added") {
          if (
            list.findIndex((suggestion) => suggestion.id == change.doc.id) == -1
          ) {
            const listClone = list;
            listClone.push({
              ...change.doc.data(),
              id: change.doc.id,
            });
            setList(listClone);
          }
        } else if (change.type == "removed") {
          console.log("removed!");

          const listClone = list;
          listClone.splice(
            listClone.findIndex((suggestion) => suggestion.id == change.doc.id),
            1
          );
          setList(listClone);
        } else if (change.type == "modified") {
          console.log("modified!");
          console.log(change.doc.data());
        }
      });
    });

    // getDocs(suggestionsQuery).then((snapshot) => {
    //   const arr = [];
    //   snapshot.forEach((doc) => arr.push({ ...doc.data(), id: doc.id }));
    //   setList(arr);
    // });
    return () => observer();
  }, []);
  useEffect(() => {
    if (!list) return;
    listMarginTop.value = withTiming(0);
    listOpacity.value = withTiming(1);
  }, [list]);
  const maximizeSuggestion = (index) => {
    setMaximizedIndex(index);
  };
  const userClicked = async (shownUserId) => {
    if (shownUserId == user.id) {
      navigation.navigate("MyProfile");
    } else {
      const friendshipStatus = await checkFriendShipStatus(user, shownUserId);
      const userData = await getUserDataById(shownUserId);
      navigation.navigate("Profile", {
        shownUser: userData,
        friendshipStatus: friendshipStatus,
      });
    }
  };
  return (
    <View>
      <Header title="SuggestionsAndBugs" goBackOption={true} />
      <View className="flex-1">
        <Animated.FlatList
          style={[
            {
              backgroundColor: appStyle.color_surface_variant,
            },
            animatedListStyle,
          ]}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 10,
            rowGap: 10,
          }}
          data={list}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index }) => (
            <View
              className="p-4 rounded"
              style={[
                { backgroundColor: appStyle.color_background },
                appComponentsDefaultStyles.shadow,
              ]}
            >
              <SuggestionHeader
                maximized={index == maximizedIndex}
                title={item.title}
                maximizeSuggestion={() => maximizeSuggestion(index)}
                minimizeSuggestion={() => setMaximizedIndex()}
              />
              {index == maximizedIndex && (
                <View
                  className="h-auto "
                  style={{ paddingVertical: 5, rowGap: 10 }}
                >
                  <CustomText
                    style={{
                      backgroundColor: appStyle.color_surface_variant,
                      color: appStyle.color_on_surface_variant,
                      padding: 5,
                    }}
                    className="text-lg rounded"
                  >
                    {item.content}
                  </CustomText>
                  <View
                    className="flex-row items-center"
                    style={{ columnGap: 10 }}
                  >
                    <CustomText className="text-lg">Sender: </CustomText>
                    <CustomButton
                      onPress={async () => await userClicked(item.senderId)}
                      round
                      className="flex-row items-center"
                      style={[
                        {
                          columnGap: 3,
                          backgroundColor: appStyle.color_primary,
                          borderWidth: 0.5,
                          borderColor: appStyle.color_outline,
                        },
                      ]}
                    >
                      <CustomText style={{ color: appStyle.color_on_primary }}>
                        {item.senderId}
                      </CustomText>
                      <FontAwesomeIcon
                        icon={faUser}
                        size={30}
                        color={appStyle.color_on_primary}
                      />
                    </CustomButton>
                  </View>
                </View>
              )}
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default SuggestionsAndBugsScreen;
