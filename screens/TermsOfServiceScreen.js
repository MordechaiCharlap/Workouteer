import React, { useCallback } from "react";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, ScrollView } from "react-native";
import * as appStyle from "../utilities/appStyleSheet";
import { safeAreaStyle } from "../components/safeAreaStyle";
import Header from "../components/Header";

const TermsOfServiceScreen = () => {
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("TermsOfService");
    }, [])
  );
  return (
    <View style={safeAreaStyle()}>
      <Header goBackOption={true} title="Terms of service" />
      <ScrollView style={{ padding: 16 }}>
        <Text style={{ color: appStyle.color_on_background }}>
          {`This is a beta version. for now all you gotta agree to, is the fact the all the data would be deleted in the near future when the app gets updated with new planned features like: group chats, workout tracking, interval timer for sets etc.
          
          Be nice to other users if you don't wanna get banned.
          
          Don't upload nudity pictures to your profile if you don't wanna get banned.
          
          By checking the checkbox you agree that you won't do anything in response for getting banned for breaking the rules.
          
          I as the developer of the app keep the option to ban people without any reason. although I don't plan to, just a way for me to be able to send the beta version to playstore without being afradi of lawsuit.

          in fact, by agreeing you are saying under no condition you can't take a legal action against the developer of the app in relation to your app use.

          This app is for showing my skills in JS and react-native. I do want to make it better for people who want to train together but whats it now is far from what I want the app to be.
          
          Have fun guys :)`}
        </Text>
      </ScrollView>
    </View>
  );
};

export default TermsOfServiceScreen;
