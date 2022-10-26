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
import { firebaseConfig } from "../firebase.config";
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

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
export const createUser = async (newAuthUserData) => {
  await setDoc(doc(db, "users", newAuthUserData.username.toLowerCase()), {
    img: newAuthUserData.img,
    username: newAuthUserData.username,
    usernameLower: newAuthUserData.usernameLower,
    birthdate: newAuthUserData.birthdate,
    friendsCount: 0,
    friendRequestCount: 0,
    friends: {},
    workoutsCount: 0,
    email: newAuthUserData.email,
    uidAuth: newAuthUserData.id,
  });
};
export const createUserRequestsDocs = async (newUserData) => {
  await setDoc(doc(db, "requests", newUserData.username.toLowerCase()), {});
  setUser(db.userDataByEmail(newUserData.email.toLowerCase()));
};
export const checkFriendShipStatus = async (userData, otherUserData) => {
  const friendsMap = new Map(Object.entries(userData.friends));
  if (friendsMap.has(otherUserData.usernameLower)) {
    return "Friends";
  } else {
    const userReqDoc = await getDoc(
      doc(db, "requests", userData.usernameLower)
    );
    const ownReqMap = new Map(Object.entries(userReqDoc.data().ownRequests));
    if (ownReqMap.has(otherUserData.usernameLower)) {
      return "SentRequest";
    } else {
      const othersReqMap = new Map(
        Object.entries(userReqDoc.data().othersRequests)
      );
      if (othersReqMap.has(otherUserData.usernameLower)) {
        return "GotRequest";
      } else return "None";
    }
  }
};
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
  const userReqRef = doc(db, "requests", user.usernameLower);
  const shownUserReqRef = doc(db, "requests", shownUser.usernameLower);
  await updateDoc(userReqRef, {
    [`ownRequests.${shownUser.usernameLower}`]: {
      username: shownUser.username,
      displayName: shownUser.displayName,
      img: shownUser.img,
      timestamp: Timestamp.now(),
    },
  });
  await updateDoc(shownUserReqRef, {
    [`othersRequests.${user.usernameLower}`]: {
      username: user.displayName,
      displayName: user.displayName,
      img: shownUser.img,
      timestamp: Timestamp.now(),
    },
  });
  await updateDoc(doc(db, "users", shownUser.usernameLower), {
    friendRequestCount: increment(1),
  });
};
export const getOthersRequests = async (userData) => {
  const userRequests = await getDoc(
    doc(db, "requests", userData.usernameLower)
  );
  const othersReqs = userRequests.data().othersRequests;
  const othersReqsMap = new Map(Object.entries(othersReqs));
  return othersReqsMap;
};
export const acceptRequest = async (userId, otherUserId) => {
  //Both: friendsCount++ add the other one to friendsList, user: remove ownRequest, otherUser: remove othersRequest
};
export const rejectRequest = async (userId, otherUserId) => {};
