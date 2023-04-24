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
  EmailAuthProvider,
  signInWithCredential,
  linkWithCredential,
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
  const [rememberMe, setRememberMe] = useState(false);
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
    console.log("auth observer");
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        console.log("state Changed, user logged in: " + authUser.email);
        const getData = async () => {
          const userData = await userDataByEmail(authUser.email.toLowerCase());
          return userData;
        };
        const setUserAsync = async () => {
          setLoginLoading(true);
          const userData = await getData();
          if (userData != null) {
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
          } else {
            setLoginLoading(false);
          }
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
  }, []);
  const updatedErrorCode = (code) => {
    setAuthErrorCode("");
    setAuthErrorCode(code);
  };
  useEffect(() => {
    var credential;
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
          setGoogleUserInfo({ ...data, credential: credential });
        })
        .catch((e) => {
          console.log("error:", e.message);
        });
    };
    if (response?.type === "success") {
      setInitialLoading(true);
      console.log("success");
      credential = GoogleAuthProvider.credential(
        null,
        response.authentication.accessToken
      );
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
  const signInWithCredentialGoogle = () => {
    if (!rememberMe) {
      console.log("not remembering");
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
      console.log("remembering");

      signInWithCredential(auth, googleUserInfo.credential)
        .then((result) => {
          // setGoogleUserInfo({
          //   uid: result.user.uid,
          //   email: result.user.email,
          // });
        })
        .catch((error) => console.log(`error:${error}`));
    }
    if (!initialLoading) setInitialLoading(false);
  };
  useEffect(() => {
    const setGoogleUserAsync = async () => {
      if (!(await checkIfEmailAvailable(googleUserInfo.email.toLowerCase()))) {
        console.log("existing user, checking if googleAuth");
        const userData = await userDataByEmail(
          googleUserInfo.email.toLowerCase()
        );
        if (userData.authGoogle == false) {
          console.log("Google auth false, moving to google linking screen");
          navigation.navigate("LinkUserWithGoogle", { userData: userData });
        } else {
          console.log(
            "Google auth true=> user logged in: " +
              googleUserInfo.email.toLowerCase()
          );
          signInWithCredentialGoogle();
        }
      } else {
        navigation.navigate("Register");
        console.log("navigated to register");
        setInitialLoading(false);
      }
    };
    console.log("googleUserInfoUseEffectActivated");
    if (googleUserInfo && googleUserInfo.credential) {
      setGoogleUserAsync();
    }
  }, [googleUserInfo]);

  const startListenToUserAsync = async (userId) => {
    console.log("Listening to user " + userId);
    unsubscribeUser = onSnapshot(doc(db, "users", userId), (doc) => {
      setUser(doc.data());
      if (initialLoading) setInitialLoading(false);
    });
  };
  const signInEmailPassword = async (email, password) => {
    setLoginLoading(true);
    try {
      if (!rememberMe) {
        console.log("not remembering user");
        await setPersistence(auth, inMemoryPersistence);
        await signInWithEmailAndPassword(auth, email, password);
        setLoginLoading(false);
        return true;
      } else {
        console.log("remembering user");
        await signInWithEmailAndPassword(auth, email, password);
        console.log("signed in!");
        setLoginLoading(false);
        return true;
      }
    } catch (error) {
      const errorCode = error.code;
      console.log("error code: ", errorCode);
      updatedErrorCode(errorCode);
      setLoginLoading(false);
      throw error;
    }
  };
  // const signInEmailPassword = (email, password) => {
  //   setLoginLoading(true);
  //   if (!rememberMe) {
  //     console.log("not remembering user");
  //     return setPersistence(auth, inMemoryPersistence)
  //       .then(() => {
  //         signInWithEmailAndPassword(auth, email, password)
  //           .then(() => {
  //             return true;
  //           })
  //           .catch((error) => {
  //             const errorCode = error.code;
  //             console.log("error code: ", errorCode);
  //             updatedErrorCode(errorCode);
  //             setLoginLoading(false);
  //           });
  //       })
  //       .catch((error) => {
  //         setLoginLoading(false);
  //       });
  //   } else {
  //     console.log("remembering user");
  //     signInWithEmailAndPassword(auth, email, password)
  //       .then(() => {
  //         console.log("signed in!");
  //         setLoginLoading(false);
  //         return true;
  //       })
  //       .catch((error) => {
  //         const errorCode = error.code;
  //         console.log("error code: ", errorCode);
  //         updatedErrorCode(errorCode);
  //         setLoginLoading(false);
  //         return true;
  //       });
  //   }
  // };
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
