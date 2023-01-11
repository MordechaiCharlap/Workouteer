import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import * as firebase from "../services/firebase";
import {
  inMemoryPersistence,
  setPersistence,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../services/firebase";
import * as Google from "expo-auth-session/providers/google";
import useAlerts from "./useAlerts";
const AuthContext = createContext({});

export const AuthPrvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const auth = firebase.auth;
  const [initialLoading, setInitialLoading] = useState(true);
  const [user, setUser] = useState(null);
  const {
    setChatsAlerts,
    setWorkoutRequestsAlerts,
    setWorkoutInvitesAlerts,
    setFriendRequestsAlerts,
    setWorkoutRequestsAcceptedAlerts,
  } = useAlerts();
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "371037963339-ju66vhm3qrc8d2hln2spg9o37305vuc4.apps.googleusercontent.com",
    androidClientId:
      "371037963339-mu5fa239lht3udpqghdnc792a9sda72o.apps.googleusercontent.com",
    webClientId:
      "371037963339-poup230qmc5e6s484udrhch0m8g2ngd5.apps.googleusercontent.com",
  });
  const addObserver = () => {
    console.log("observer");
    var unsubscribeAlertsListener;
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        const setUserAsync = async () => {
          const userData = await firebase.userDataByEmail(
            authUser.email.toLowerCase()
          );
          setUser(userData);
          unsubscribeAlertsListener = onSnapshot(
            doc(db, "alerts", userData.id),
            (doc) => {
              const alertsData = doc.data();
              setChatsAlerts(alertsData.chats);
              setWorkoutRequestsAlerts(alertsData.workoutRequests);
              setWorkoutInvitesAlerts(alertsData.workoutInvites);
              setFriendRequestsAlerts(alertsData.friendRequests);
              setWorkoutRequestsAcceptedAlerts(
                alertsData.workoutRequestsAccepted
              );
            }
          );
          console.log("state Changed, user logged in: " + authUser.email);
          setInitialLoading(false);
        };
        setUserAsync();
      } else {
        setUser(null);
        if (unsubscribeAlertsListener) unsubscribeAlertsListener();
        console.log("state Changed, user logged out");
        setInitialLoading(false);
      }
    });
  };

  useEffect(() => {
    if (response?.type === "success") {
      setAccessToken(response.authentication.accessToken);
    }
  }, [response]);
  async function getUserData() {
    let userInfoResponse = await fetch(
      "https://www.googleapis.com/userinfo/v2/me",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    userInfoResponse
      .json()
      .then((data) => {
        setUserInfo(data);
        console.log("The DATA!: ", data);
      })
      .catch((e) => {
        console.log("error:", e.message);
      });
  }

  const signInGoogleAccount = async () => {
    if (accessToken) {
      console.log("getting user data!");
      await getUserData();
    } else {
      console.log("promptAsyncing!");
      await promptAsync({ useProxy: false, showInRecents: true });
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
        .then(() => {
          console.log("signed in!");
        })
        .catch((error) => {
          console.log(error);
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
        addObserver,
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
