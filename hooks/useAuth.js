import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import {
  inMemoryPersistence,
  setPersistence,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { onSnapshot, doc, updateDoc } from "firebase/firestore";
import {
  db,
  userDataByEmail,
  checkIfEmailAvailable,
  auth as firebaseAuth,
} from "../services/firebase";
import * as Google from "expo-auth-session/providers/google";
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

  var unsubscribeUser = null;
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "371037963339-ju66vhm3qrc8d2hln2spg9o37305vuc4.apps.googleusercontent.com",
    androidClientId:
      "371037963339-mu5fa239lht3udpqghdnc792a9sda72o.apps.googleusercontent.com",
    webClientId:
      "371037963339-poup230qmc5e6s484udrhch0m8g2ngd5.apps.googleusercontent.com",
  });
  useEffect(() => {
    if (!googleUserInfo) {
      console.log("auth observer");
      onAuthStateChanged(auth, (authUser) => {
        if (authUser) {
          console.log("state Changed, user logged in: " + authUser.email);
          const setUserAsync = async () => {
            setLoginLoading(true);
            const userData = await userDataByEmail(
              authUser.email.toLowerCase()
            );
            console.log("Listening to user");
            unsubscribeUser = onSnapshot(
              doc(db, "users", userData.id),
              (doc) => {
                setUser(doc.data());
                if (initialLoading) setInitialLoading(false);
              }
            );
            setTimeout(() => {
              setLoginLoading(false);
            }, 5000);
          };
          setUserAsync();
        } else {
          console.log("state Changed, user signed out");
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
  }, []);
  const updatedErrorCode = (code) => {
    setAuthErrorCode("");
    setAuthErrorCode(code);
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
      console.log(response);
      const credential = GoogleAuthProvider.credential(
        null,
        response.authentication.accessToken
      );
      console.log(credential);
      signInWithCredential(auth, credential)
        .then((value) => console.log(value))
        .catch((error) => console.log(`error:${error}`));
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
  useEffect(() => {
    const setGoogleUserAsync = async () => {
      if (!(await checkIfEmailAvailable(googleUserInfo.email.toLowerCase()))) {
        console.log("existing user");
        const userData = await userDataByEmail(
          googleUserInfo.email.toLowerCase()
        );
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
    if (googleUserInfo) {
      setGoogleUserAsync();
    }
  }, [googleUserInfo]);

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
              updatedErrorCode(errorCode);
              setLoginLoading(false);
            });
        })
        .catch((error) => {
          setLoginLoading(false);
        });
    } else {
      console.log("remembering user");
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          console.log("signed in!");
          setLoginLoading(false);
        })
        .catch((error) => {
          const errorCode = error.code;
          console.log("error code: ", errorCode);
          updatedErrorCode(errorCode);
          setLoginLoading(false);
        });
    }
  };
  const userSignOut = () => {
    setInitialLoading(true);
    if (googleUserInfo) {
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
        userSignOut,
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
