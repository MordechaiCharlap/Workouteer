import React, { useRef } from "react";
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
import { getCurrentLocation } from "../services/geoService";
const AuthContext = createContext({});

export const AuthPrvider = ({ children }) => {
  const navigation = useNavigation();
  const [googleUserInfo, setGoogleUserInfo] = useState(null);
  const auth = firebaseAuth;
  const [initialLoading, setInitialLoading] = useState(true);
  const [authErrorCode, setAuthErrorCode] = useState();
  const [loginLoading, setLoginLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const unsubscribeUser = useRef();
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "371037963339-ju66vhm3qrc8d2hln2spg9o37305vuc4.apps.googleusercontent.com",
    androidClientId:
      "371037963339-mu5fa239lht3udpqghdnc792a9sda72o.apps.googleusercontent.com",
    webClientId:
      "371037963339-poup230qmc5e6s484udrhch0m8g2ngd5.apps.googleusercontent.com",
  });
  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        const getData = async () => {
          const userData = await userDataByEmail(authUser.email.toLowerCase());
          return userData;
        };
        const setUserAsync = async () => {
          setLoginLoading(true);
          const userData = await getData();
          if (userData != null) {
            unsubscribeUser.current = onSnapshot(
              doc(db, "users", userData.id),
              (doc) => {
                setUser(doc.data());
              }
            );
          }
        };
        setUserAsync();
      } else {
        setInitialLoading(false);
        if (unsubscribeUser.current) {
          unsubscribeUser.current();
        }
        if (user) {
          setUser(null);
        }
      }
    });
  }, []);

  useEffect(() => {
    var credential;
    const getUserData = async (accessToken) => {
      let userInfoResponse = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      userInfoResponse
        .json()
        .then((data) => {
          setGoogleUserInfo({ ...data, credential: credential });
        })
        .catch((e) => {
          console.log("error:", e.message);
        });
    };
    if (response?.type === "success") {
      credential = GoogleAuthProvider.credential(
        null,
        response.authentication.accessToken
      );
      getUserData(response.authentication.accessToken);
    } else {
      setLoginLoading(false);
    }
  }, [response]);
  useEffect(() => {
    return () => {
      if (unsubscribeUser.current) unsubscribeUser.current();
    };
  }, []);
  useEffect(() => {
    const setGoogleUserAsync = async () => {
      if (!(await checkIfEmailAvailable(googleUserInfo.email.toLowerCase()))) {
        const userData = await userDataByEmail(
          googleUserInfo.email.toLowerCase()
        );
        if (userData.authGoogle == false) {
          navigation.navigate("LinkUserWithGoogle", { userData: userData });
        } else {
          signInWithCredentialGoogle();
        }
      } else {
        navigation.navigate("Register");
      }
    };
    if (googleUserInfo && googleUserInfo.credential) {
      setGoogleUserAsync().then(() => {});
    }
  }, [googleUserInfo]);
  useEffect(() => {
    if (user && !userLoaded) {
      setUserLoaded(true);
    } else if (!user) setUserLoaded(false);
  }, [user]);
  useEffect(() => {
    setInitialLoading(false);
    if (!userLoaded) return;
    const getLocation = async () => {
      await getCurrentLocation(user);
    };
    getLocation();
    setTimeout(() => {
      setLoginLoading(false);
    }, 5000);
  }, [userLoaded]);
  const signInGoogleAccount = async () => {
    setLoginLoading(true);
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
  const signInWithCredentialGoogle = () => {
    if (!rememberMe) {
      setPersistence(auth, inMemoryPersistence).then(() => {
        signInWithCredential(auth, googleUserInfo.credential)
          .then((result) => {
            // setGoogleUserInfo({
            //   uid: result.user.uid,
            //   email: result.user.email,
            // });
          })
          .catch((error) => console.log(`error:${error}`));
      });
    } else {
      signInWithCredential(auth, googleUserInfo.credential)
        .then((result) => {
          // setGoogleUserInfo({
          //   uid: result.user.uid,
          //   email: result.user.email,
          // });
        })
        .catch((error) => console.log(`error:${error}`));
    }
  };

  const startListenToUserAsync = async (userId) => {
    unsubscribeUser.current = onSnapshot(doc(db, "users", userId), (doc) => {
      setUser(doc.data());
    });
  };
  const signInEmailPassword = async (email, password) => {
    setLoginLoading(true);
    if (!rememberMe) {
      await setPersistence(firebaseAuth, inMemoryPersistence);
    } else {
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setAuthErrorCode(null);
      return true;
    } catch (error) {
      console.log(`error: ${error.code}`);
      setAuthErrorCode(error.code);
      setLoginLoading(false);
      return false;
    }
  };
  const userSignOut = () => {
    setInitialLoading(true);
    if (googleUserInfo) {
      if (unsubscribeUser) unsubscribeUser.current();
      setGoogleUserInfo(null);
    } else
      signOut(auth)
        .then(() => {})
        .catch((error) => {});

    setUser(null);
  };
  return (
    <AuthContext.Provider
      value={{
        userLoaded,
        user,
        setUser,
        setRememberMe,
        googleUserInfo,
        startListenToUserAsync,
        createUserEmailAndPassword,
        signInEmailPassword,
        signInGoogleAccount,
        userSignOut,
        signInWithCredentialGoogle,
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
