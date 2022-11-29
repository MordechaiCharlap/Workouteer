import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  connectStorageEmulator,
} from "firebase/storage";
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
  orderBy,
  limit,
  arrayUnion,
  deleteDoc,
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
export const savePreferencesChanges = async (
  userId,
  newAcceptMinAge,
  newAcceptMaxAge,
  newAcceptMale,
  newAcceptFemale
) => {
  await updateDoc(doc(db, "users", userId), {
    acceptMinAge: newAcceptMinAge,
    acceptMaxAge: newAcceptMaxAge,
    acceptMale: newAcceptMale,
    acceptFemale: newAcceptFemale,
  });
};
export const saveSettingsChanges = async (
  userId,
  newIsPublic,
  newShowOnline
) => {
  await updateDoc(doc(db, "users", userId), {
    isPublic: newIsPublic,
    showOnline: newShowOnline,
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
    workouts: {},
    notificationsCount: 0,
    chatPals: {},
    friends: {},
    chats: [],
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
const addChatConnection = async (userId, otherUserId, chatId) => {
  await updateDoc(doc(db, "users", userId), {
    [`chatPals.${otherUserId}`]: chatId,
    [`chats.${chatId}`]: Timestamp.now(),
  });
};
const getSeenByMapGroupChat = (senderId, chat) => {
  console.log(chat);
  const chatMembers = new Map(Object.entries(chat.members));
  const seenByMap = new Map();
  for (var memberId of chatMembers.keys()) {
    if (memberId != senderId) seenByMap.set(memberId.toString(), false);
  }

  return seenByMap;
};
export const getOrCreatePrivateChat = async (user, otherUser) => {
  //This function called just when I dont have a chat already
  const otherUserChatPals = new Map(Object.entries(otherUser.chatPals));
  var chatId;
  if (!otherUserChatPals.has(otherUser.usernameLower)) {
    //chat doesnt exists
    //Create chat
    const chatRef = await addDoc(collection(db, `chats`), {
      isGroupChat: false,
      members: {
        [user.usernameLower]: Timestamp.now(),
        [otherUser.usernameLower]: Timestamp.now(),
      },
      messagesCount: 0,
    });
    chatId = chatRef.id;
    await addChatConnection(
      otherUser.usernameLower,
      user.usernameLower,
      chatId
    );
  } else {
    //He has me but I dont have him
    chatId = otherUserChatPals.get(user.usernameLower);
  }

  await addChatConnection(user.usernameLower, otherUser.usernameLower, chatId);
  const chat = (await getDoc(doc(db, `chats/${chatId}`))).data();
  return {
    messagesCount: chat.messagesCount,
    isGroupChat: chat.isGroupChat,
    members: chat.members,
    id: chatId,
  };
};
export const sendPrivateMessage = async (
  userId,
  otherUserId,
  chat,
  content
) => {
  const message = {
    content: content,
    seenBy: { [otherUserId]: false },
    sender: userId,
    sentAt: Timestamp.now(),
  };
  const newMessage = await addDoc(
    collection(db, `chats/${chat.id}/messages`),
    message
  );
  await updateDoc(doc(db, `chats/${chat.id}`), {
    lastMessage: {
      content: content,
      seenBy: { [otherUserId]: false },
      sender: userId,
      sentAt: Timestamp.now(),
      id: newMessage.id,
    },
    messagesCount: increment(1),
  });
};
export const getChatsArrayIncludeUsers = async (user) => {
  const chatsArr = [];
  const userChatsMap = new Map(Object.entries(user.chats));
  for (var chatId of userChatsMap.keys()) {
    var chat = (await getDoc(doc(db, "chats", `${chatId}`))).data();
    var chatToPush = {
      chat: {
        id: `${chatId}`,
        ...chat,
      },
    };
    if (!chat.isGroupChat) {
      const members = new Map(Object.entries(chat.members));
      for (var key of members.keys()) {
        if (key != user.usernameLower) {
          chatToPush = {
            chat: chatToPush.chat,
            user: (await getDoc(doc(db, "users", key))).data(),
          };
        }
      }
    }
    chatsArr.push(chatToPush);
  }

  return chatsArr;
};
export const getFriendsArray = async (user) => {
  const allFriendsMap = new Map(Object.entries(user.friends));
  const friendsArr = [];
  for (var key of allFriendsMap.keys()) {
    var userData = await userDataById(key);
    friendsArr.push(userData);
  }
  return friendsArr;
};
export const seenByMe = async (userId, chatId, messageId) => {
  await updateDoc(doc(db, `chats/${chatId}/messages/${messageId}`), {
    [`seenBy.${userId}`]: true,
  });
};
export const getFirstPageMessages = async (chatId) => {
  const messagesArr = [];
  console.log("chatId=>" + chatId);
  const messagesRef = collection(db, `chats/${chatId}/messages`);
  const q = query(messagesRef, orderBy("sentAt", "desc"), limit(25));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const message = doc.data();
    messagesArr.push({
      content: message.content,
      sentAt: message.sentAt,
      seenBy: message.seenBy,
      sender: message.sender,
      id: doc.id,
    });
  });
  return messagesArr;
};
export const createWorkout = async (workout) => {
  const newWorkoutRef = await addDoc(collection(db, "workouts"), workout);
  await updateDoc(doc(db, "users", workout.creator), {
    [`workouts.${newWorkoutRef.id}`]: workout.startingTime,
  });
};
export const getFutureWorkouts = async (user, now) => {
  const workoutsArray = [];
  const userWorkouts = new Map(Object.entries(user.workouts));
  for (var [key, value] of userWorkouts) {
    if (value.toDate() > now) {
      console.log("Found workout");
      workoutsArray.push({
        id: key,
        ...(await getDoc(doc(db, "workouts", key))).data(),
      });
    }
  }
  workoutsArray.sort(
    (a, b) =>
      a.startingTime.toDate().getTime() - b.startingTime.toDate().getTime()
  );
  return workoutsArray;
};
export const getPastWorkouts = async (user, now) => {
  const workoutsArray = [];
  const limitDate = new Date();
  limitDate.setDate(limitDate.getDate() - 7);
  const userWorkouts = new Map(Object.entries(user.workouts));
  for (var [key, value] of userWorkouts) {
    if (value.toDate() < now && value.toDate() >= limitDate.getDate()) {
      workoutsArray.push({
        id: key,
        ...(await getDoc(doc(db, "workouts", key))).data(),
      });
    }
  }
  workoutsArray.sort(
    (a, b) =>
      b.startingTime.toDate().getTime() - a.startingTime.toDate().getTime()
  );
  return workoutsArray;
};
const deleteChatFromDbIfNeeded = async (chat) => {
  const memebers = new Map(Object.entries(chat.members));
  if (memebers.size == 1) {
    await deleteDoc(doc(db, "chats", chat.id));
  }
};
export const deletePrivateChatForUser = async (user, chatAndUserItem) => {
  await updateDoc(doc(db, "users", user.usernameLower), {
    [`chatPals.${chatAndUserItem.user.usernameLower}`]: deleteField(),
    [`chats.${chatId}`]: deleteField(),
  });
  await deleteChatFromDbIfNeeded(chatAndUserItem.chat);
};
export const deleteGroupChatForUser = async (user, chat) => {};
export const cancelWorkout = async (user, workout) => {
  const membersMap = new Map(Object.entries(workout.members));
  await updateDoc(doc(db, "users", user.usernameLower), {
    [`workouts.${workout.id}`]: deleteField(),
  });
  for (var [key, value] of membersMap) {
    if (value == true) {
      await updateDoc(doc(db, "users", key), {
        [`workouts.${workout.id}`]: deleteField(),
      });
    }
  }
  await deleteDoc(doc(db, "workouts", workout.id));
};
export const leaveWorkout = async (user, workout) => {
  await updateDoc(doc(db, "workouts", workout.id), {
    [`members.${user.usernameLower}`]: deleteField(),
  });
  await updateDoc(doc(db, "users", user.usernameLower), {
    [`workouts.${workout.id}`]: deleteField(),
  });
};
export const getWorkoutResults = async (preferences) => {
  var q;
  const workoutsArr = [];
  const workoutsCollection = collection(db, "workouts");
  if (preferences.type == 0) {
    if (preferences.sex == "everyone") {
      q = query(
        workoutsCollection,
        where("startingTime", ">=", Timestamp.fromDate(preferences.minTime)),
        where("startingTime", "<=", Timestamp.fromDate(preferences.maxTime)),
        orderBy("startingTime", "asc"),
        limit(30)
      );
    } else {
      q = query(
        workoutsCollection,
        where("startingTime", ">=", Timestamp.fromDate(preferences.minTime)),
        where("startingTime", "<=", Timestamp.fromDate(preferences.maxTime)),
        where("sex", "==", preferences.sex),
        orderBy("startingTime", "asc"),
        limit(30)
      );
    }
  } else {
    if (preferences.sex == "everyone") {
      q = query(
        workoutsCollection,
        where("type", "==", preferences.type),
        where("startingTime", ">=", Timestamp.fromDate(preferences.minTime)),
        where("startingTime", "<=", Timestamp.fromDate(preferences.maxTime)),
        orderBy("startingTime", "asc"),
        limit(30)
      );
    } else {
      workoutsCollection,
        where("type", "==", preferences.type),
        where("startingTime", ">=", Timestamp.fromDate(preferences.minTime)),
        where("startingTime", "<=", Timestamp.fromDate(preferences.maxTime)),
        where("sex", "==", preferences.sex),
        orderBy("startingTime", "asc"),
        limit(30);
    }
  }

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    workoutsArr.push({
      ...doc.data(),
      id: doc.id,
    });
  });
  return workoutsArr;
};
