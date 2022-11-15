import React from "react";
import { createContext, useContext } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
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
        const setUserAsync = async () => {
          setUser(await firebase.userDataByEmail(authUser.email.toLowerCase()));
        };
        setUserAsync();
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
      })
      .catch((error) => {
        console.log(error);
        Alert.alert(error.message);
      });
  };
  const userSignOut = () => {
    console.log("trying to sign out");
    signOut(auth)
      .then(() => {})
      .catch((error) => {});
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        signInEmailPassword,
        userSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default function useAuth() {
  return useContext(AuthContext);
}
