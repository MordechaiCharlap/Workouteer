import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Password from "./registerScreen/Password";
import * as appStyle from "../utils/appStyleSheet";
import useAuth from "../hooks/useAuth";
import { linkWithCredential } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import useFirebase from "../hooks/useFirebase";
import CustomButton from "./basic/CustomButton";
import CustomText from "./basic/CustomText";
const LoginWithKnownEmail = (props) => {
  const { db, auth } = useFirebase();
  const { signInEmailPassword, googleUserInfo } = useAuth();
  const [password, setPassword] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const loginAndLink = async () => {
    setLoggingIn(true);
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
        } else {
          setLoggingIn(false);
        }
      }
    }
  };

  return (
    <View
      style={{
        backgroundColor: appStyle.color_background_variant,
        borderWidth: 1,
        borderColor: appStyle.color_outline,
      }}
      className="p-4 rounded-lg gap-y-3 w-5/6"
    >
      <Text
        className="text-center text-lg"
        style={{ color: appStyle.color_on_background }}
      >
        Use your workouteer account to link both identifications.
      </Text>

      <View style={style.knownInput}>
        <Text
          style={{
            textAlign: "center",
            color: appStyle.color_on_surface_variant,
          }}
        >
          {googleUserInfo.email}
        </Text>
      </View>
      <View>
        <Password style={style} valueChanged={setPassword} />
      </View>
      <View className="gap-y-1">
        <View className="flex-row gap-x-1">
          <CustomButton
            round
            onPress={loginAndLink}
            style={{ backgroundColor: appStyle.color_on_background }}
            className="w-1 grow items-center py-2"
          >
            <CustomText
              className="text-center tracking-widest font-bold text-xl"
              style={{
                color: appStyle.color_background,
              }}
            >
              {loggingIn ? "Logging in..." : "Login"}
            </CustomText>
          </CustomButton>
        </View>

        <TouchableOpacity>
          <CustomText
            className="text-center"
            style={{
              color: appStyle.color_on_surface_variant,
            }}
          >
            I forgot the password
          </CustomText>
        </TouchableOpacity>
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
    backgroundColor: appStyle.color_surface_variant,
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
