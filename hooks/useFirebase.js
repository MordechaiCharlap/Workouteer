import { initializeAuth } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { getReactNativePersistence } from "firebase/auth/react-native";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebase.config";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FirebaseContext = createContext({});
export const FirebaseProvider = ({ children }) => {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  return (
    <FirebaseContext.Provider value={{ db, storage, auth }}>
      {children}
    </FirebaseContext.Provider>
  );
};
export default function useFirebase() {
  return useContext(FirebaseContext);
}
