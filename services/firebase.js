import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  deleteField,
  doc,
  updateDoc,
  increment,
  setDoc,
  getDoc,
  getDocs,
  where,
  query,
  collection,
  Timestamp,
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
export const db = getFirestore(firebaseApp);

export const cancelFriendRequest = async (user, shownUser) => {
  const userReqRef = doc(db, "requests", user.usernameLower);
  const shownUserReqRef = doc(db, "requests", shownUser.usernameLower);
  await updateDoc(userReqRef, {
    [`ownRequests.${shownUser.usernameLower}`]: deleteField(),
  });
  await updateDoc(shownUserReqRef, {
    [`othersRequests.${user.usernameLower}`]: deleteField(),
  });
  await updateDoc(doc(db, "users", shownUser.usernameLower), {
    friendRequestCount: increment(-1),
  });
};
export const sendFriendRequest = async (user, shownUser) => {
  setFriendshipStatus("SentRequest");
  const userReqRef = doc(db, "requests", user.usernameLower);
  const shownUserReqRef = doc(db, "requests", shownUser.usernameLower);
  await updateDoc(userReqRef, {
    [`ownRequests.${shownUser.usernameLower}`]: {
      displayName: shownUser.username,
      img: shownUser.img,
      timestamp: Timestamp.now(),
    },
  });
  await updateDoc(shownUserReqRef, {
    [`othersRequests.${user.usernameLower}`]: {
      displayName: user.username,
      img: shownUser.img,
      timestamp: Timestamp.now(),
    },
  });
  await updateDoc(doc(db, "users", shownUser.usernameLower), {
    friendRequestCount: increment(1),
  });
};
export const searchUser = async (text) => {
  return await getDoc(doc(db, "users", text.toLowerCase()));
};
export const checkUsername = async (username) => {
  const usersRef = collection(db, "users");
  const q = query(
    usersRef,
    where("usernameLower", "==", username.toLowerCase())
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.size > 0) {
    console.log("bigger than 0", querySnapshot.size);
    return false;
  }
  return true;
};
export const checkEmail = async (email) => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.size > 0) {
    return false;
  }
  return true;
};
export const userDataByEmail = async (email) => {
  var userData;
  const q = query(collection(db, "users"), where("email", "==", email));
  await getDocs(q).then((snapshot) => {
    snapshot.forEach((doc) => {
      userData = doc.data();
    });
  });
  return userData;
};
export const updatePersonalData = async (newData) => {
  await updateDoc(doc(db, "users", user.usernameLower), {
    firstName: newData.firstName,
    lastName: newData.lastName,
    isMale: newData.isMale,
    acceptMale: newData.acceptMale,
    acceptFemale: newData.acceptFemale,
    acceptMinAge: newData.acceptMinAge,
    acceptMaxAge: newData.acceptMaxAge,
    isPublic: newData.isPublic,
  });
};
export const createUser = async (newUserData) => {
  await setDoc(doc(db, "users", newUserData.username.toLowerCase()), {
    img: newUserData.img,
    username: newUserData.username,
    usernameLower: newUserData.usernameLower,
    birthdate: newUserData.birthdate,
    friendsCount: 0,
    friendRequestCount: 0,
    friends: {},
    workoutsCount: 0,
    email: newUserData.email,
    id: newUserData.id,
  });
};
export const createUserRequestsDocs = async (newUserData) => {
  await setDoc(doc(db, "requests", newUserData.username.toLowerCase()), {});
  setUser(db.userDataByEmail(newUserData.email.toLowerCase()));
};
