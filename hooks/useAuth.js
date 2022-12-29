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
import * as Google from "expo-auth-session/providers/google";
import { Alert } from "react-native";

const AuthContext = createContext({});

export const AuthPrvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const auth = firebase.auth;
  const [initialLoading, setInitialLoading] = useState(true);
  const [user, setUser] = useState(null);
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
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        const setUserAsync = async () => {
          const userData = await firebase.userDataByEmail(
            authUser.email.toLowerCase()
          );
          setUser(userData);
          const chats = new Map(Object.entries(userData.chats));
          console.log("chats: ", chats);
          var count = 0;
          for (var chatId of chats.keys()) {
            const chat = await firebase.getChat(chatId);
            console.log(chat);
            const membersMap = new Map(Object.entries(chat.members));
            if (membersMap.get(user.usernameLower).unreadAlert) {
              count++;
            }
          }
          console.log("unread chats: ", count);
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
  };

  useEffect(() => {
    console.log("checking response");
    if (response?.type === "success") {
      setAccessToken(response.authentication.accessToken);
      console.log("got success response!");
    } else {
      console.log("response unsuccesful:", response);
    }
  }, [response]);
  // useEffect(() => {
  //   onAuthStateChanged(auth, (authUser) => {
  //     if (authUser) {
  //       const setUserAsync = async () => {
  //         setUser(await firebase.userDataByEmail(authUser.email.toLowerCase()));
  //         console.log("state Changed, user logged in: " + authUser.email);
  //         setInitialLoading(false);
  //       };
  //       setUserAsync();
  //     } else {
  //       setUser(null);
  //       console.log("state Changed, user logged out");
  //       setInitialLoading(false);
  //     }
  //   });
  // }, []);
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
