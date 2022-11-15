import { View, Text } from "react-native";
import React from "react";
import { createContext, useContext } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import * as firebase from "../services/firebase";
import { useEffect } from "react";
const AuthContext = createContext({});

export const AuthPrvider = ({ children }) => {
  const auth = firebase.auth;
  const [user, setUser] = useState(null);
  const signInEmailPassword = (email, password) => {
    useEffect(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
          console.log("state Changed, user logged in");
        } else {
          setUser(null);
          console.log("state Changed, user logged out");
        }
      });
    }, []);

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
