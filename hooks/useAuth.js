import React from "react";
import { createContext, useContext } from "react";
import * as firebase from "../services/firebase";
import { useEffect, useState } from "react";
import {
  inMemoryPersistence,
  setPersistence,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "@react-native-firebase/auth";
import { Alert } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId:
    "371037963339-poup230qmc5e6s484udrhch0m8g2ngd5.apps.googleusercontent.com",
});
const AuthContext = createContext({});

export const AuthPrvider = ({ children }) => {
  const configauth = firebase.auth;
  const [initialLoading, setInitialLoading] = useState(true);
  const [user, setUser] = useState(null);
  useEffect(() => {
    onAuthStateChanged(configauth, (authUser) => {
      if (authUser) {
        const setUserAsync = async () => {
          setUser(await firebase.userDataByEmail(authUser.email.toLowerCase()));
          console.log("state Changed, user logged in: " + authUser.email);
          setInitialLoading(false);
        };
        setUserAsync();
      } else {
        setUser(null);
        console.log("state Changed, user logged out");
        setInitialLoading(false);
      }
    });
  }, []);
  const signInGoogleAccount = async () => {
    const userInfo = await GoogleSignin.signIn();
    console.log(userInfo);
  };

  const signInEmailPassword = (email, password, rememberMe) => {
    if (!rememberMe) {
      console.log("not remembering user");
      setPersistence(configauth, inMemoryPersistence)
        .then(() => {
          signInWithEmailAndPassword(configauth, email, password);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("remembering user");
      signInWithEmailAndPassword(configauth, email, password)
        .then(async () => {
          console.log("signed in!");
        })
        .catch((error) => {
          console.log(error);
          Alert.alert(error.message);
        });
    }
  };
  const userSignOut = () => {
    console.log("trying to sign out");
    signOut(configauth)
      .then(() => {})
      .catch((error) => {
        console.log("signed out succesfuly");
      });
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        signInEmailPassword,
        signInGoogleAccount,
        userSignOut,
        initialLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default function useAuth() {
  return useContext(AuthContext);
}
