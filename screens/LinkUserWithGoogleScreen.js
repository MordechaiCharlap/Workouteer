import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { React, useCallback, useState } from "react";
import useAuth from "../hooks/useAuth";
import { safeAreaStyle } from "../components/safeAreaStyle";
import * as appStyle from "../utils/appStyleSheet";
import { calculateAge } from "../utils/calculateAge";
import useNavbarDisplay from "../hooks/useNavbarDisplay";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import LoginWithKnownEmail from "../components/LoginWithKnownEmail";
import { updateDoc, doc } from "firebase/firestore";
import useFirebase from "../hooks/useFirebase";
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
        <>
          <Text
            style={{ color: appStyle.color_primary }}
            className="text-lg text-center mb-10"
          >
            That email is associated with this user: is that you?
          </Text>
          <View
            style={{
              backgroundColor: appStyle.color_background_variant,
              borderWidth: 1,
              borderColor: appStyle.color_primary,
            }}
            className="rounded flex-row p-2 gap-x-2 items-center w-5/6 h-20"
          >
            <View className="h-full aspect-square">
              <Image
                source={{
                  uri: userData.img,
                }}
                className="h-full aspect-square bg-white rounded-full"
              />
            </View>
            <View className="justify-between">
              <View className="flex-row gap-x-1 items-center">
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
              <Text style={{ color: appStyle.color_on_primary }}>
                {userData.email}
              </Text>
            </View>
          </View>
          <View className="absolute bottom-10 w-2/3 gap-y-2">
            <TouchableOpacity
              onPress={() => {
                setShowLogin(!showLogin);
              }}
              style={styles.yesButton}
            >
              <Text style={styles.yesText}>Yes.</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.noButton}>
              <Text style={styles.noText}>No. Delete fake user.</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  yesButton: {
    width: "100%",
    borderRadius: 4,
    backgroundColor: appStyle.color_primary,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  noButton: {
    width: "100%",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: appStyle.color_primary,
    backgroundColor: appStyle.color_background,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
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
