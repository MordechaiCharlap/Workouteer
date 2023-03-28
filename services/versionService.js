import { doc, getDoc } from "@firebase/firestore";
import Constants from "expo-constants";
import { db } from "./firebase";
export const checkIfVersionUpdated = async () => {
  // A helper function to compare two version numbers
  function compareVersions(versionA, versionB) {
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
  }

  const currentAppVersion = Constants.manifest.version;
  const minimumRequiredVersion = (await getDoc(doc(db, "appData/specs"))).data()
    .version;

  if (compareVersions(currentAppVersion, minimumRequiredVersion) < 0) {
    console.log(
      `The app needs update, current version: ${currentAppVersion}, needed version: ${minimumRequiredVersion}`
    );
  } else {
    console.log("The app is updated, current version: " + currentAppVersion);
  }
};
