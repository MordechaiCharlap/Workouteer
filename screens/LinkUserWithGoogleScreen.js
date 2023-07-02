import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { React, useCallback, useState } from "react";
import useAuth from "../hooks/useAuth";
import { safeAreaStyle } from "../components/safeAreaStyle";
import * as appStyle from "../utils/appStyleSheet";
import { calculateAge } from "../utils/calculateAge";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import LoginWithKnownEmail from "../components/LoginWithKnownEmail";
import { updateDoc, doc, Timestamp } from "firebase/firestore";
import useFirebase from "../hooks/useFirebase";
import CustomButton from "../components/basic/CustomButton";
const LinkUserWithGoogleScreen = ({ route }) => {
  const { db } = useFirebase();
  const { setCurrentScreen } = useNavbarDisplay();
  useFocusEffect(
    useCallback(() => {
      setCurrentScreen("LinkUserWithGoogle");
    }, [])
  );

  const { signInWithCredentialGoogle } = useAuth();
  const userData = route.params.userData;

  const [showLogin, setShowLogin] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const replaceAuthEmailWithAuthGoogle = async () => {
    await updateDoc(doc(db, "users", userData.id), {
      authGoogle: true,
      authEmail: false,
    });
    signInWithCredentialGoogle();
  };
  return (
    <View style={safeAreaStyle()} className="justify-center p-2 items-center">
      {showLogin ? (
        <LoginWithKnownEmail
          id={userData.id}
          setShowLogin={setShowLogin}
          setForgotPassword={setForgotPassword}
        />
      ) : forgotPassword ? (
        <View
          style={{
            backgroundColor: appStyle.color_background_variant,
            borderWidth: 1,
            borderColor: appStyle.color_primary,
          }}
          className="p-4 rounded gap-y-3 w-5/6"
        >
          <Text
            className="text-lg text-center"
            style={{ color: appStyle.color_on_primary }}
          >
            No worries, just use your google account for now until we would add
            a `get new passowrd option`
          </Text>
          <TouchableOpacity
            onPress={replaceAuthEmailWithAuthGoogle}
            style={styles.yesButton}
          >
            <Text style={styles.yesText}>Use the app!</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{ flex: 1, paddingHorizontal: 16, justifyContent: "center" }}
        >
          <Text
            style={{ color: appStyle.color_primary }}
            className="text-lg text-center mb-10"
          >
            That email is associated with this user; is that you?
          </Text>
          <View
            style={{
              backgroundColor: appStyle.color_on_background,
              borderWidth: 1,
              borderColor: appStyle.color_primary,
            }}
            className="rounded-full flex-row w-100 p-2 items-center h-20"
          >
            <Image
              source={{
                uri: userData.img,
              }}
              className="h-full aspect-square rounded-full"
            />
            <View className="flex-row flex-1 gap-x-1 items-center justify-center">
              <Text
                style={{ color: appStyle.color_on_primary }}
                className="font-semibold text-lg"
              >
                {userData.id},
              </Text>
              <Text
                style={{ color: appStyle.color_on_primary }}
                className="text-lg"
              >
                {calculateAge(userData.birthdate.toDate())}
              </Text>
            </View>
          </View>
          <View style={{ height: 30 }} />
          <View>
            <CustomButton
              round
              className="py-2"
              onPress={() => {
                setShowLogin(!showLogin);
              }}
              style={styles.yesButton}
            >
              <Text style={styles.yesText}>Yes.</Text>
            </CustomButton>
            <View style={{ height: 10 }} />
            <CustomButton className="py-2" round style={styles.noButton}>
              <Text style={styles.noText}>No. Delete fake user.</Text>
            </CustomButton>
          </View>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  yesButton: {
    width: "100%",
    backgroundColor: appStyle.color_primary,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  noButton: {
    width: "100%",
    paddingVertical: 4,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: appStyle.color_primary,
    backgroundColor: appStyle.color_background,
  },
  yesText: {
    fontSize: 20,
    color: appStyle.color_on_primary,
  },
  noText: {
    fontSize: 20,
    color: appStyle.color_primary,
  },
});
export default LinkUserWithGoogleScreen;
