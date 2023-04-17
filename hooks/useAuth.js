import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import {
  inMemoryPersistence,
  setPersistence,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  getAuth,
} from "firebase/auth";
import { onSnapshot, doc, updateDoc } from "firebase/firestore";
import {
  db,
  userDataByEmail,
  checkIfEmailAvailable,
  auth as firebaseAuth,
} from "../services/firebase";
import * as Google from "expo-auth-session/providers/google";
import useAlerts from "./useAlerts";
import { useNavigation } from "@react-navigation/native";
const AuthContext = createContext({});

export const AuthPrvider = ({ children }) => {
  const navigation = useNavigation();
  const [googleUserInfo, setGoogleUserInfo] = useState(null);
  const auth = firebaseAuth;
  const [initialLoading, setInitialLoading] = useState(true);
  const [authErrorCode, setAuthErrorCode] = useState();
  const [loginLoading, setLoginLoading] = useState(false);
  const [user, setUser] = useState(null);
  var unsubscribeAlerts = null;
  var unsubscribeUser = null;
  const {
    setChatsAlerts,
    setWorkoutRequestsAlerts,
    setWorkoutInvitesAlerts,
    setFriendRequestsAlerts,
    setNewWorkoutsAlerts,
  } = useAlerts();
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "371037963339-ju66vhm3qrc8d2hln2spg9o37305vuc4.apps.googleusercontent.com",
    androidClientId:
      "371037963339-mu5fa239lht3udpqghdnc792a9sda72o.apps.googleusercontent.com",
    webClientId:
      "371037963339-poup230qmc5e6s484udrhch0m8g2ngd5.apps.googleusercontent.com",
  });
  const addAuthObserver = () => {
    if (!googleUserInfo) {
      console.log("auth observer");
      onAuthStateChanged(auth, (authUser) => {
        console.log("AuthStateChanged");
        console.log(authUser);
        if (authUser) {
          console.log("User signed in");
          const setUserAsync = async () => {
            setLoginLoading(true);
            const userData = await userDataByEmail(
              authUser.email.toLowerCase()
            );
            console.log("Listening to alerts");
            unsubscribeAlerts = onSnapshot(
              doc(db, "alerts", userData.id),
              (doc) => {
                const alertsData = doc.data();
                setChatsAlerts(alertsData.chats);
                setWorkoutRequestsAlerts(alertsData.workoutRequests);
                setWorkoutInvitesAlerts(alertsData.workoutInvites);
                setFriendRequestsAlerts(alertsData.friendRequests);
                setNewWorkoutsAlerts(alertsData.newWorkouts);
              }
            );
            console.log("Listening to user");
            unsubscribeUser = onSnapshot(
              doc(db, "users", userData.id),
              (doc) => {
                setUser(doc.data());
                if (initialLoading) setInitialLoading(false);
              }
            );
            console.log(
              "state Changed, user logged in: " + authUser.email.toLowerCase()
            );
            setTimeout(() => {
              setLoginLoading(false);
            }, 5000);
          };
          setUserAsync();
        } else {
          if (unsubscribeAlerts) {
            unsubscribeAlerts();
            console.log("Stops listening to alerts");
          }
          if (unsubscribeUser) {
            unsubscribeUser();
            console.log("Stops listening to user");
          }
          if (user) {
            console.log("nulling User");
            setUser(null);
            console.log("state Changed, user logged out");
          }
          setInitialLoading(false);
        }
      });
    }
  };

  useEffect(() => {
    const getUserData = async (accessToken) => {
      console.log("Access token: " + accessToken);
      let userInfoResponse = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      userInfoResponse
        .json()
        .then((data) => {
          setGoogleUserInfo(data);
        })
        .catch((e) => {
          console.log("error:", e.message);
        });
    };
    if (response?.type === "success") {
      setInitialLoading(true);
      console.log("success");
      getUserData(response.authentication.accessToken);
    } else {
      console.log("response not successfull");
    }
  }, [response]);

  const signInGoogleAccount = async () => {
    console.log("promptAsyncing!");
    await promptAsync({ useProxy: false, showInRecents: true });
  };
  const createUserEmailAndPassword = async (email, password) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user.uid;
  };
  const setGoogleUserAsync = async () => {
    if (!(await checkIfEmailAvailable(googleUserInfo.email.toLowerCase()))) {
      console.log("existing user");
      const userData = await userDataByEmail(
        googleUserInfo.email.toLowerCase()
      );
      console.log("Listening to alerts");
      unsubscribeAlerts = onSnapshot(doc(db, "alerts", userData.id), (doc) => {
        const alertsData = doc.data();
        setChatsAlerts(alertsData.chats);
        setWorkoutRequestsAlerts(alertsData.workoutRequests);
        setWorkoutInvitesAlerts(alertsData.workoutInvites);
        setFriendRequestsAlerts(alertsData.friendRequests);
        setNewWorkoutsAlerts(alertsData.newWorkouts);
      });
      console.log("Listening to user");
      unsubscribeUser = onSnapshot(doc(db, "users", userData.id), (doc) => {
        setUser(doc.data());
        if (initialLoading) setInitialLoading(false);
      });
      console.log(
        "google user logged in: " + googleUserInfo.email.toLowerCase()
      );
    } else {
      navigation.navigate("Register");

      setInitialLoading(false);
    }
  };
  const signInEmailPassword = (email, password, rememberMe) => {
    setLoginLoading(true);
    if (!rememberMe) {
      console.log("not remembering user");
      return setPersistence(auth, inMemoryPersistence)
        .then(() => {
          signInWithEmailAndPassword(auth, email, password)
            .then()
            .catch((error) => {
              const errorCode = error.code;
              console.log("error code: ", errorCode);
              setAuthErrorCode(errorCode);
              setLoginLoading(false);
            });
        })
        .catch((error) => {
          setLoginLoading(false);
        });
    } else {
      console.log("remembering user");
      // Sign in the user with email and password
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          console.log("signed in!");
        })
        .catch((error) => {
          console.error(error);
          setAuthErrorCode(error.code);
          setLoginLoading(false);
        });
    }
    setLoginLoading(false);
  };
  const userSignOut = () => {
    setInitialLoading(true);
    if (googleUserInfo) {
      if (unsubscribeAlerts) unsubscribeAlerts();
      console.log("Stops listening to alerts");
      if (unsubscribeUser) unsubscribeUser();
      console.log("Stops listening to user");
      setGoogleUserInfo(null);
    } else
      signOut(auth)
        .then(() => {})
        .catch((error) => {});

    setUser(null);
    setInitialLoading(false);
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        googleUserInfo,
        createUserEmailAndPassword,
        signInEmailPassword,
        signInGoogleAccount,
        setGoogleUserAsync,
        userSignOut,
        addAuthObserver,
        initialLoading,
        loginLoading,
        authErrorCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default function useAuth() {
  return useContext(AuthContext);
}
