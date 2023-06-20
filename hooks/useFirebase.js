import {
  getAuth,
  initializeAuth,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { getReactNativePersistence } from "firebase/auth/react-native";
import { getFirestore } from "firebase/firestore";
import { getApp, getApps, initializeApp } from "firebase/app";
import { firebaseConfig } from "../firebase.config";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FirebaseContext = createContext({});
export const FirebaseProvider = ({ children }) => {
  let app, auth, storage, db;

  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
      db = getFirestore(app);
      storage = getStorage(app);
    } catch (error) {
    }
  } else {
    app = getApp();
    try {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } catch (error) {
      auth = getAuth(app);
    }
    db = getFirestore();
    storage = getStorage();
  }

  if (auth && db && storage && app)
    return (
      <FirebaseContext.Provider value={{ db, storage, auth }}>
        {children}
      </FirebaseContext.Provider>
    );
};
export default function useFirebase() {
  return useContext(FirebaseContext);
}
