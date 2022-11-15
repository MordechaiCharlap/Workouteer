import { View, Text } from "react-native";
import React from "react";
import { createContext, useContext } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import * as firebase from "../services/firebase";
import { useEffect, useState } from "react";
const AuthContext = createContext({});

export const AuthPrvider = ({ children }) => {
  const auth = firebase.auth;
  const [user, setUser] = useState(null);
  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        console.log("state Changed, user logged in: " + authUser.email);
      } else {
        setUser(null);
        console.log("state Changed, user logged out");
      }
    });
  }, []);
  const signInEmailPassword = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async () => {
        console.log("signed in!");

        const userData = await firebase.userDataByEmail(email.toLowerCase());
        console.log(userData);
        setUser(userData);
      })
      .catch((error) => {
        console.log(error);
        Alert.alert(error.message);
      });
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        signInEmailPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default function useAuth() {
  return useContext(AuthContext);
}
