import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzTd7-Pb9kj1Rkod4KlMv56F-ldacg-PE",
  authDomain: "workouteer-54450.firebaseapp.com",
  projectId: "workouteer-54450",
  storageBucket: "workouteer-54450.appspot.com",
  messagingSenderId: "371037963339",
  appId: "1:371037963339:web:955114c8511a0d73b6b9ce",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const authImport = getAuth(firebaseApp);
export const firestoreImport = getFirestore(firebaseApp);
