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
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { Alert } from "react-native";

const [request, response, promptAsync] = Google.useAuthRequest({
  expoClientId:
    "371037963339-ju66vhm3qrc8d2hln2spg9o37305vuc4.apps.googleusercontent.com",
  androidClientId:
    "371037963339-mu5fa239lht3udpqghdnc792a9sda72o.apps.googleusercontent.com",
  webClientId:
    "371037963339-poup230qmc5e6s484udrhch0m8g2ngd5.apps.googleusercontent.com",
});
WebBrowser.maybeCompleteAuthSession();

const AuthContext = createContext({});

export const AuthPrvider = ({ children }) => {
  const auth = firebase.auth;
  const [initialLoading, setInitialLoading] = useState(true);
  const [user, setUser] = useState(null);
  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
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
  const signInGoogleAccount = () => {
    console.log("Opening login-google func!");
    promptAsync({ useProxy: false, showInRecents: true });
  };
  const signInEmailPassword = (email, password, rememberMe) => {
    if (!rememberMe) {
      console.log("not remembering user");
      setPersistence(auth, inMemoryPersistence)
        .then(() => {
          signInWithEmailAndPassword(auth, email, password);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("remembering user");
      signInWithEmailAndPassword(auth, email, password)
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
    signOut(auth)
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
