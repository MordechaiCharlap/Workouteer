import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Password from "./registerScreen/Password";
import * as appStyle from "../utils/appStyleSheet";
import useAuth from "../hooks/useAuth";
import { linkWithCredential } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import useFirebase from "../hooks/useFirebase";
const LoginWithKnownEmail = (props) => {
  const { db, auth } = useFirebase();
  const { signInEmailPassword, googleUserInfo } = useAuth();
  const [password, setPassword] = useState("");
  const loginAndLink = async () => {
    const isLoggedIn = await signInEmailPassword(
      googleUserInfo.email,
      password
    );
    if (isLoggedIn) {
      try {
        await linkWithCredential(auth.currentUser, googleUserInfo.credential);
        await updateDoc(doc(db, "users", props.id), {
          authGoogle: true,
        });
      } catch (error) {
        if (error.code == "auth/provider-already-linked") {
          await updateDoc(doc(db, "users", props.id), {
            authGoogle: true,
          });
        }
      }
    }
  };

  return (
    <View
      style={{
        backgroundColor: appStyle.color_background_variant,
        borderWidth: 1,
        borderColor: appStyle.color_primary,
      }}
      className="p-4 rounded gap-y-3 w-5/6"
    >
      <Text
        className="text-center text-lg"
        style={{ color: appStyle.color_on_primary }}
      >
        Use your workouteer account to link both identifications.
      </Text>

      <View style={style.knownInput}>
        <Text style={{ color: appStyle.color_on_primary }}>
          {googleUserInfo.email}
        </Text>
      </View>
      <View>
        <Password style={style} valueChanged={setPassword} />
      </View>
      <View className="gap-y-1">
        <View className="flex-row gap-x-1">
          <TouchableOpacity
            onPress={loginAndLink}
            style={{ backgroundColor: appStyle.color_background }}
            className="w-1 grow items-center py-2"
          >
            <Text
              className="text-center tracking-widest font-bold text-xl"
              style={{
                color: appStyle.color_primary,
              }}
            >
              Login
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <TouchableOpacity
            onPress={() => {
              props.setForgotPassword(true);
              props.setShowLogin(false);
            }}
            style={{ backgroundColor: appStyle.color_primary }}
            className="w-full items-center rounded py-2"
          >
            <Text
              className="text-center  text-lg"
              style={{
                color: appStyle.color_on_primary,
              }}
            >
              I Forgot the password
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const style = StyleSheet.create({
  input: {
    paddingLeft: 10,
    height: 40,
    borderWidth: 2,
    borderColor: appStyle.color_background,
    borderRadius: 4,
    color: appStyle.color_primary,
    backgroundColor: appStyle.color_on_primary,
    paddingHorizontal: 5,
    justifyContent: "center",
  },
  knownInput: {
    paddingLeft: 10,
    height: 40,
    borderRadius: 4,
    backgroundColor: appStyle.color_primary,
    paddingHorizontal: 5,
    justifyContent: "center",
  },
  badInput: {
    paddingLeft: 10,
    height: 40,
    borderWidth: 2,
    borderColor: appStyle.color_error,
    color: appStyle.color_primary,
    backgroundColor: appStyle.color_on_primary,
    borderRadius: 4,
    paddingHorizontal: 5,
    justifyContent: "center",
  },

  inputError: {
    color: appStyle.color_on_primary,
  },
  inputContainer: { marginBottom: 10 },
  text: { color: appStyle.color_on_primary },
});

export default LoginWithKnownEmail;
