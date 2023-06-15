import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "../firebase.config";

let db = false;

export const getDb = () => {
  if (!db) {
    const app = initializeApp(firebaseConfig);

    db = getFirestore(app);
  }

  return db;
};
