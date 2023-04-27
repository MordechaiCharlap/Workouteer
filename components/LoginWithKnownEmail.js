import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Password from "./registerScreen/Password";
import * as appStyle from "../utilities/appStyleSheet";
import useAuth from "../hooks/useAuth";
import { auth } from "../services/firebase";
import { linkWithCredential } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
const LoginWithKnownEmail = (props) => {
  const { signInEmailPassword, googleUserInfo } = useAuth();
  const [password, setPassword] = useState("");
  const loginAndLink = async () => {
    const isLoggedIn = await signInEmailPassword(
      googleUserInfo.email,
      password
    );
    console.log(isLoggedIn);
    if (isLoggedIn) {
      try {
        await linkWithCredential(auth.currentUser, googleUserInfo.credential);
        console.log("updating both auths true");
        await updateDoc(doc(db, "users", props.id), {
          authGoogle: true,
        });
        console.log("both auth is true now");
      } catch (error) {
        console.log(`errorCode:${error.code}`);
        if (error.code == "auth/provider-already-linked") {
          console.log(
            "Already linked, updating authGoogle to true so wont happen again"
          );
          // await updateDoc(doc(db, "users", props.id), {
          //   authGoogle: true,
          // });
        }
      }
    }
  };

  return (
    <View
      style={{
        backgroundColor: appStyle.color_bg_variant,
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
            style={{ backgroundColor: appStyle.color_bg }}
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
    borderColor: appStyle.color_bg,
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
