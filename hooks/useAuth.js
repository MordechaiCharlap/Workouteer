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
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";
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
  const signInGoogleAccount = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({ userInfo });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
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
