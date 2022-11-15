import { View, Text } from "react-native";
import React from "react";
import { createContext, useContext } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import * as firebase from "../services/firebase";
const AuthContext = createContext({});

export const AuthPrvider = ({ children }) => {
  const auth = firebase.auth;
  const [user, setUser] = useState(null);
  const signIn = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async () => {
        console.log("signed in!");

        const userData = await firebase.userDataByEmail(email.toLowerCase());
        console.log(userData);
        setUser(userData);
        navigation.navigate("Home");
      })
      .catch((error) => {
        console.log(error);
        Alert.alert(error.message);
      });
  };
  return (
    <AuthContext.Provider value={{ user: user }}>
      {children}
    </AuthContext.Provider>
  );
};
export default function useAuth() {
  return useContext(AuthContext);
}
