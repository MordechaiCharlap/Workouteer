import React, { createContext, useContext, useEffect, useState } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import Constants from "expo-constants";
import useFirebase from "./useFirebase";
const AppDataContext = createContext({});
export const AppDataProvider = ({ children }) => {
  const { db } = useFirebase();
  const [specs, setSpecs] = useState();
  const [usersData, setUsersData] = useState();
  const [isVersionUpToDate, setIsVersionUpToDate] = useState(true);
  const compareVersions = (versionA, versionB) => {
    const a = versionA.split(".");
    const b = versionB.split(".");
    for (let i = 0; i < 3; i++) {
      const numA = parseInt(a[i] || 0, 10);
      const numB = parseInt(b[i] || 0, 10);
      if (numA > numB) {
        return 1;
      }
      if (numB > numA) {
        return -1;
      }
    }
    return 0;
  };
  const isVersionUpToDateFunc = () => {
    const minimumRequiredVersion = specs.minimumRequiredVersion;
    const currentAppVersion = Constants.manifest.version;

    if (compareVersions(currentAppVersion, minimumRequiredVersion) < 0) {
      return false;
    } else {
      return true;
    }
  };
  useEffect(() => {
    const unsubscribeSpecs = onSnapshot(doc(db, `appData/specs`), (doc) => {
      setSpecs(doc.data());
    });
    const getUsersData = async () => {
      setUsersData((await getDoc(doc(db, "appData/usersData"))).data());
    };
    getUsersData();
    return () => {
      unsubscribeSpecs();
    };
  }, []);
  useEffect(() => {
    if (specs) setIsVersionUpToDate(isVersionUpToDateFunc());
  }, [specs]);
  return (
    <AppDataContext.Provider value={{ specs, isVersionUpToDate, usersData }}>
      {children}
    </AppDataContext.Provider>
  );
};
export default function useAppData() {
  return useContext(AppDataContext);
}
