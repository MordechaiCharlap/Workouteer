import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  getFirestore,
  deleteField,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  increment,
  getDoc,
  getDocs,
  where,
  query,
  collection,
  Timestamp,
} from "firebase/firestore";
import { firebaseConfig } from "../firebase.config";
const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
export const updateContext = async (userId) => {
  const updatedDoc = await getDoc(doc(db, "users", userId));
  return updatedDoc.data();
};
export const uploadProfileImage = async (userId, uri) => {
  const blob = await fetch(uri).then((r) => r.blob());
  const storageRef = ref(storage, `profile-pics/${userId}.jpg`);
  await uploadBytes(storageRef, blob).then((snapshot) => {
    console.log("Uploaded a blob or file!");
  });

  return await getDownloadURL(ref(storage, `profile-pics/${userId}.jpg`));
};
export const saveProfileChanges = async (
  userId,
  newDisplayName,
  newDescription,
  newImageUrl
) => {
  await updateDoc(doc(db, "users", userId), {
    displayName: newDisplayName,
    description: newDescription,
    img: newImageUrl,
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
export const userDataById = async (userId) => {
  var userData = await getDoc(doc(db, "users", userId));
  return userData.data();
};
export const updatePersonalData = async (newData) => {
  await updateDoc(doc(db, "users", user.usernameLower), {
    firstName: newData.firstName,
    lastName: newData.lastName,
    displayName: newData.displayName,
    isMale: newData.isMale,
    acceptMale: newData.acceptMale,
    acceptFemale: newData.acceptFemale,
    acceptMinAge: newData.acceptMinAge,
    acceptMaxAge: newData.acceptMaxAge,
  });
};
export const createUser = async (newUserData) => {
  await setDoc(doc(db, "users", newUserData.username.toLowerCase()), {
    img: newUserData.img,
    username: newUserData.username,
    displayName: newUserData.displayName,
    usernameLower: newUserData.usernameLower,
    birthdate: newUserData.birthdate,
    email: newUserData.email,
    uidAuth: newUserData.id,
    friendsCount: 0,
    friendRequestCount: 0,
    workoutsCount: 0,
    notificationsCount: 0,
    chatPals: {},
    friends: {},
    description: "",
    isPublic: true,
    showOnline: true,
  });
};
export const createUserRequestsDocs = async (newUserData) => {
  await setDoc(doc(db, "requests", newUserData.username.toLowerCase()), {
    receivedRequests: {},
    sentRequests: {},
  });
};
export const checkFriendShipStatus = async (userData, otherUserId) => {
  const friendsMap = new Map(Object.entries(userData.friends));
  if (friendsMap.has(otherUserId)) {
    return "Friends";
  } else {
    const userReqDoc = await getDoc(
      doc(db, "requests", userData.usernameLower)
    );
    const sentReqsMap = new Map(Object.entries(userReqDoc.data().sentRequests));
    if (sentReqsMap.has(otherUserId)) {
      return "SentRequest";
    } else {
      const receivedReqMap = new Map(
        Object.entries(userReqDoc.data().receivedRequests)
      );
      if (receivedReqMap.has(otherUserId)) {
        return "ReceivedRequest";
      } else return "None";
    }
  }
};
export const cancelFriendRequest = async (user, shownUser) => {
  const userReqRef = doc(db, "requests", user.usernameLower);
  const shownUserReqRef = doc(db, "requests", shownUser.usernameLower);
  await updateDoc(userReqRef, {
    [`sentRequests.${shownUser.usernameLower}`]: deleteField(),
  });
  await updateDoc(shownUserReqRef, {
    [`receivedRequests.${user.usernameLower}`]: deleteField(),
  });
  await updateDoc(doc(db, "users", shownUser.usernameLower), {
    friendRequestCount: increment(-1),
  });
};
export const sendFriendRequest = async (userId, shownUser) => {
  const userReqDoc = doc(db, "requests", userId);
  const shownUserReqDoc = doc(db, "requests", shownUser.usernameLower);
  await updateDoc(userReqDoc, {
    [`sentRequests.${shownUser.usernameLower}`]: {
      timestamp: Timestamp.now(),
    },
  });
  await updateDoc(shownUserReqDoc, {
    [`receivedRequests.${userId}`]: {
      timestamp: Timestamp.now(),
    },
  });
  await updateDoc(doc(db, "users", shownUser.usernameLower), {
    friendRequestCount: increment(1),
  });
};
export const getReceivedRequests = async (userData) => {
  const userRequests = await getDoc(
    doc(db, "requests", userData.usernameLower)
  );
  const receivedReqs = userRequests.data().receivedRequests;
  const receivedReqsMap = new Map(Object.entries(receivedReqs));
  return receivedReqsMap;
};
export const acceptRequest = async (userId, otherUserId) => {
  //user: friendsCount++ && add other to friendsList && increment (-1) friendRequestsCount
  await updateDoc(doc(db, "users", userId), {
    friendsCount: increment(1),
    friendRequestCount: increment(-1),
    [`friends.${otherUserId}`]: {
      timestamp: Timestamp.now(),
    },
  });
  //otherUser: friendsCount++ && add user to friendsList
  await updateDoc(doc(db, "users", otherUserId), {
    friendsCount: increment(1),
    [`friends.${userId}`]: {
      timestamp: Timestamp.now(),
    },
  });
  //delete both side's end of the request
  await deleteRequest(userId, otherUserId);
};
export const rejectRequest = async (userId, otherUserId) => {
  //user: increment (-1) friendRequestsCount
  await updateDoc(doc(db, "users", userId), {
    friendRequestCount: increment(-1),
  });
  //delete both side's end of the request
  await deleteRequest(userId, otherUserId);
};
const deleteRequest = async (userId, otherUserId) => {
  //  user: remove receivedRequest
  await updateDoc(doc(db, "requests", userId), {
    [`receivedRequests.${otherUserId}`]: deleteField(),
  });
  //otherUser: remove sentRequest
  await updateDoc(doc(db, "requests", otherUserId), {
    [`sentRequests.${userId}`]: deleteField(),
  });
};
export const removeFriend = async (userId, otherUserId) => {
  //Both: friendsCount--, remove each other from friends
  await updateDoc(doc(db, "users", userId), {
    friendsCount: increment(-1),
    [`friends.${otherUserId}`]: deleteField(),
  });
  await updateDoc(doc(db, "users", otherUserId), {
    friendsCount: increment(-1),
    [`friends.${userId}`]: deleteField(),
  });
};
export const createChatConnection = async (userId, otherUserId) => {
  await updateDoc(doc(db, "users", userId), {
    [`chatPals.${otherUserId}`]: true,
  });
  await setDoc(doc(db, "chats", `${userId}-${otherUserId}`), {
    lastMessage: {},
    messagesCount: 0,
  });
};
export const sendMessage = async (user, otherUser, content) => {
  const userChatPals = new Map(Object.entries(user.chatPals));
  if (!userChatPals.has(otherUser.usernameLower))
    await createChatConnection(user.usernameLower, otherUser.usernameLower);
  const otherUserChatPals = new Map(Object.entries(user.chatPals));
  if (!otherUserChatPals.has(otherUser.usernameLower))
    await createChatConnection(otherUser.usernameLower, user.usernameLower);
  //Update last message for self and add message to collection
  await updateDoc(
    doc(db, `chats/${user.usernameLower}-${otherUser.usernameLower}`),
    {
      lastMessage: {
        content: content,
        isRead: false,
        sender: user.usernameLower,
        sentAt: Timestamp.now(),
      },
      messagesCount: increment(1),
    }
  );
  await addDoc(
    doc(db, `chats/${user.usernameLower}-${otherUser.usernameLower}/messages`),
    {
      content: content,
      isRead: false,
      sender: user.usernameLower,
      sentAt: Timestamp.now(),
    }
  );
  //Update last message for other user and add message to collection
  await updateDoc(
    doc(db, `chats/${otherUser.usernameLower}-${user.usernameLower}`),
    {
      lastMessage: {
        content: content,
        isRead: false,
        sender: user.usernameLower,
        sentAt: Timestamp.now(),
      },
      messagesCount: increment(1),
    }
  );
  await addDoc(
    doc(db, `chats/${otherUser.usernameLower}-${user.usernameLower}/messages`),
    {
      content: content,
      isRead: false,
      sender: user.usernameLower,
      sentAt: Timestamp.now(),
    }
  );
};
export const getChatsArray = async (user) => {
  const allChatPals = new Map(Object.entries(user.chatPals));
  const chatsArr = [];
  for (var key in allChatPals.keys()) {
    chatsArr.push(
      (await getDoc(doc(db, "chats", `${user.usernameLower}-${key}`))).data()
    );
  }
  return chatsArr;
};
