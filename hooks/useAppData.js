import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Platform } from "react-native";
import Constants from "expo-constants";
const AppDataContext = createContext({});
export const AppDataProvider = ({ children }) => {
  const [appData, setAppData] = useState();
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
    const minimumRequiredVersion = appData.minimumRequiredVersion;
    const currentAppVersion = Constants.manifest.version;

    if (compareVersions(currentAppVersion, minimumRequiredVersion) < 0) {
      return false;
    } else {
      return true;
    }
  };
  useEffect(() => {
    const getAppData = async () => {
      const appDataFromDB = (await getDoc(doc(db, "appData/specs"))).data();
      setAppData(appDataFromDB);
    };
    getAppData();
  }, []);
  useEffect(() => {
    if (appData) setIsVersionUpToDate(isVersionUpToDateFunc());
  }, [appData]);
  return (
    <AppDataContext.Provider value={{ appData, isVersionUpToDate }}>
      {children}
    </AppDataContext.Provider>
  );
};
export default function useAppData() {
  return useContext(AppDataContext);
}
