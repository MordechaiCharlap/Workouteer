import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  connectStorageEmulator,
} from "firebase/storage";
import * as ImageManipulator from "expo-image-manipulator";
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
export const getUserDataById = async (userId) => {
  return await updateContext(userId);
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
  const usernameRef = await getDoc(doc(db, "users", username));
  if (usernameRef.exists()) return false;
  else return true;
};
export const checkEmail = async (email) => {
  const q = query(
    collection(db, "users"),
    where("email", "==", email),
    limit(1)
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return true;
  } else return false;
};
export const userDataByEmail = async (email) => {
  var userData;
  console.log("getting data on:", email);
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
export const updatePersonalData = async (user, newData) => {
  await updateDoc(doc(db, "users", user.id), {
    defaultCountry: newData.defaultCountry,
    firstName: newData.firstName,
    lastName: newData.lastName,
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
    id: newUserData.id,
    birthdate: newUserData.birthdate,
    email: newUserData.email,
    uidAuth: newUserData.uidAuth,
    friendsCount: 0,
    friendRequestsCount: 0,
    workouts: {},
    chatPals: {},
    friends: {},
    chats: [],
    description: "",
    isPublic: true,
    showOnline: true,
    defaultCity: null,
    defaultCountry: null,
  });

  await setDoc(doc(db, "alerts", newUserData.username.toLowerCase()), {
    chats: {},
    friendRequests: {},
    workoutInvites: {},
    workoutRequests: {},
    workoutRequestsAccepted: {},
  });
  await setDoc(doc(db, "friendRequests", newUserData.username.toLowerCase()), {
    receivedRequests: {},
    sentRequests: {},
  });
};
export const checkFriendShipStatus = async (userData, otherUserId) => {
  const friendsMap = new Map(Object.entries(userData.friends));
  if (friendsMap.has(otherUserId)) {
    return "Friends";
  } else {
    const userReqDoc = await getDoc(doc(db, "friendRequests", userData.id));
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
export const getFriendRequests = async (userId) => {
  const returnedArray = [];
  const userRequests = await getDoc(doc(db, "friendRequests", userId));
  const receivedReqs = userRequests.data().receivedRequests;
  for (var [key, value] of Object.entries(receivedReqs)) {
    const user = await getDoc(dpc(db, "users", key));
    returnedArray.push({ user: user.data(), timestamp: value });
  }
  returnedArray.sort((a, b) => {
    a.timestamp - b.timestamp;
  });
  return returnedArray;
};
export const sendFriendRequest = async (userId, shownUser) => {
  const userReqDoc = doc(db, "friendRequests", userId);
  const shownUserReqDoc = doc(db, "friendRequests", shownUser.id);
  await updateDoc(userReqDoc, {
    [`sentRequests.${shownUser.id}`]: {
      timestamp: Timestamp.now(),
    },
  });
  await updateDoc(shownUserReqDoc, {
    [`receivedRequests.${userId}`]: {
      timestamp: Timestamp.now(),
    },
  });
  await updateDoc(doc(db, "users", shownUser.id), {
    friendRequestsCount: increment(1),
  });
  await friendRequestAlert(userId, shownUser.id);
};
export const acceptFriendRequest = async (userId, otherUserId) => {
  //user: friendsCount++ && add other to friendsList && increment (-1) friendRequestsCount
  await updateDoc(doc(db, "users", userId), {
    friendsCount: increment(1),
    friendRequestsCount: increment(-1),
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
export const cancelFriendRequest = async (userId, otherUserId) => {
  await updateDoc(doc(db, "users", otherUserId), {
    friendRequestsCount: increment(-1),
  });
  await deleteRequest(otherUserId, userId);
  await removeFriendRequestAlert(userId, otherUserId);
};
export const rejectFriendRequest = async (userId, otherUserId) => {
  await updateDoc(doc(db, "users", userId), {
    friendRequestsCount: increment(-1),
  });
  await deleteRequest(userId, otherUserId);
};
const deleteRequest = async (receiverId, senderId) => {
  //  reveicer: remove receivedRequest
  await updateDoc(doc(db, "friendRequests", receiverId), {
    [`receivedRequests.${senderId}`]: deleteField(),
  });
  //sender: remove sentRequest
  await updateDoc(doc(db, "friendRequests", senderId), {
    [`sentRequests.${receiverId}`]: deleteField(),
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
  if (!otherUserChatPals.has(user.id)) {
    //chat doesnt exists
    //Create chat
    const chatRef = await addDoc(collection(db, `chats`), {
      isGroupChat: false,
      members: {
        [user.id]: { joinDate: Timestamp.now() },
        [otherUser.id]: {
          joinDate: Timestamp.now(),
        },
      },
      messagesCount: 0,
    });
    chatId = chatRef.id;
    await addChatConnection(otherUser.id, user.id, chatId);
  } else {
    //He has me but I dont have him
    chatId = otherUserChatPals.get(user.id);
    await updateDoc(doc(db, `chats/${chatId}`), {
      [`members.${user.id}`]: Timestamp.now(),
    });
  }

  await addChatConnection(user.id, otherUser.id, chatId);
  const chat = await getChat(chatId);
  return {
    ...chat,
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
  const membersMap = new Map(Object.entries(chat.members));
  for (var [key, value] of membersMap) {
    if (key != userId) {
      await addChatAlert(key, chat.id);
      membersMap.set(key, value);
    }
  }
  let newArray = membersMap.entries();

  let newMembersObject = Object.fromEntries(newArray);
  await updateDoc(doc(db, `chats/${chat.id}`), {
    lastMessage: {
      content: content,
      seenBy: { [otherUserId]: false },
      sender: userId,
      sentAt: Timestamp.now(),
      id: newMessage.id,
    },
    messagesCount: increment(1),
    members: newMembersObject,
  });
};
export const getChatsArrayIncludeUsers = async (user) => {
  const chatsArr = [];
  const userChatsMap = new Map(Object.entries(user.chats));
  for (var chatId of userChatsMap.keys()) {
    var chat = await getChat(chatId);
    var chatToPush = {
      chat: {
        id: chatId,
        ...chat,
      },
    };
    if (!chat.isGroupChat) {
      const members = new Map(Object.entries(chat.members));
      for (var key of members.keys()) {
        if (key != user.id) {
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
export const getChat = async (chatId) => {
  return (await getDoc(doc(db, "chats", `${chatId}`))).data();
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
export const addCountryAndCityToDbIfNeeded = async (country, city) => {
  const safeCountryString = country.replace(/\s/g, "-");
  const countryDoc = await getDoc(doc(db, "countriesData", safeCountryString));
  if (!countryDoc.exists()) {
    await setDoc(doc(db, "countriesData", safeCountryString), {
      cities: {
        [`${city}`]: {},
      },
    });
    await updateDoc(doc(db, "countriesData", "countries"), {
      [`names.${country}`]: true,
    });
  } else {
    const citiesMap = new Map(Object.entries(countryDoc.data().cities));
    if (!citiesMap.has(city)) {
      await updateDoc(doc(db, "countriesData", safeCountryString), {
        [`cities.${city}`]: {},
      });
    }
  }
};
export const createWorkout = async (workout) => {
  await addCountryAndCityToDbIfNeeded(workout.country, workout.city);

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
  console.log(user.workouts);
  for (var [key, value] of Object.entries(user.workouts)) {
    if (value.toDate() < now) {
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
const removeUserFromMembersOrDeleteChat = async (user, chat) => {
  const members = new Map(Object.entries(chat.members));
  if (members.size == 1) {
    await deleteDoc(doc(db, "chats", chat.id));
  } else {
    await updateDoc(doc(db, "chats", chat.id), {
      [`members.${user.id}`]: deleteField(),
    });
  }
};
export const deletePrivateChatForUser = async (
  user,
  chatAndUserItem,
  chatAlerts
) => {
  await updateDoc(doc(db, "users", user.id), {
    [`chatPals.${chatAndUserItem.user.id}`]: deleteField(),
    [`chats.${chatAndUserItem.chat.id}`]: deleteField(),
  });
  await removeUserFromMembersOrDeleteChat(user, chatAndUserItem.chat);
  if (chatAlerts) {
    await removeChatAlerts(user.id, chatAndUserItem.chat);
  }
};
export const deleteGroupChatForUser = async (user, chat) => {
  await updateDoc(doc(db, "users", user.id), {
    [`chats.${chat.id}`]: deleteField(),
  });
  await removeUserFromMembersOrDeleteChat(user, chatAndUserItem.chat);
};
export const cancelWorkout = async (user, workout) => {
  const membersMap = new Map(Object.entries(workout.members));
  await updateDoc(doc(db, "users", user.id), {
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
    [`members.${user.id}`]: deleteField(),
  });
  await updateDoc(doc(db, "users", user.id), {
    [`workouts.${workout.id}`]: deleteField(),
  });
};
export const getWorkoutResults = async (preferences) => {
  const workoutsArr = [];
  var q = query(
    collection(db, "workouts"),
    where("country", "==", preferences.country),
    where("city", "==", preferences.city),
    where("startingTime", ">=", Timestamp.fromDate(preferences.minTime)),
    where("startingTime", "<=", Timestamp.fromDate(preferences.maxTime)),
    orderBy("startingTime", "asc"),
    limit(30)
  );
  if (preferences.type != 0) {
    q = query(q, where("type", "==", preferences.type));
  }
  if (preferences.sex != "everyone") {
    q = query(q, where("sex", "==", preferences.sex));
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
export const getCountries = async () => {
  const countriesArr = [];
  const countriesDoc = await getDoc(doc(db, "countriesData", "countries"));
  const countriesMap = new Map(Object.entries(countriesDoc.data().names));
  for (var key of countriesMap.keys()) {
    countriesArr.push({ label: key, value: key });
  }
  return countriesArr;
};

export const getCities = async (country) => {
  const citiesArr = [];
  const safeCountryString = country.replace(/\s/g, "-");
  const countryDoc = await getDoc(doc(db, "countriesData", safeCountryString));
  if (countryDoc.exists()) {
    const citiesMap = new Map(Object.entries(countryDoc.data().cities));
    for (var key of citiesMap.keys()) {
      citiesArr.push({ label: key, value: key });
    }
  }
  return citiesArr;
};
export const getWorkoutMembers = async (workout) => {
  const returnedMembersArr = [];
  const membersArr = Object.keys(workout.members);
  const qMembers = query(
    collection(db, "users"),
    where("id", "in", membersArr)
  );
  const snapMembers = await getDocs(qMembers);

  snapMembers.forEach((doc) => {
    returnedMembersArr.push(doc.data());
  });

  return returnedMembersArr;
};
export const getWorkoutRequesters = async (workout) => {
  const requestersArray = [];
  for (var [key, value] of Object.entries(workout.requests)) {
    if (value == true) {
      requestersArray.push({
        user: await getUserDataById(key),
        accepted: null,
      });
    }
  }
  return requestersArray;
};
export const inviteFriendToWorkout = async (invitedId, workout) => {
  await updateDoc(doc(db, "workouts", workout.id), {
    [`invites.${invitedId}`]: true,
  });
  await workoutInviteAlert(invitedId, workout);
};
export const rejectWorkoutInvite = async (invitedId, workout) => {
  await updateDoc(doc(db, "workouts", workout.id), {
    [`invites.${invitedId}`]: false,
  });
  await removeWorkoutInviteAlert(invitedId, workout);
};
export const acceptWorkoutInvite = async (invitedId, workout) => {
  await updateDoc(doc(db, "workouts", workout.id), {
    [`invites.${invitedId}`]: deleteField(),
    [`members.${invitedId}`]: true,
  });
  await updateDoc(doc(db, "users", invitedId), {
    [`workouts.${workout.id}`]: workout.startingTime,
  });
  await removeWorkoutInviteAlert(invitedId, workout);
};
export const requestToJoinWorkout = async (requesterId, workout) => {
  await updateDoc(doc(db, "workouts", workout.id), {
    [`requests.${requesterId}`]: true,
  });
  await workoutRequestAlert(requesterId, workout);
};
export const cancelWorkoutRequest = async (requesterId, workout) => {
  await updateDoc(doc(db, "workouts", workout.id), {
    [`requests.${requesterId}`]: deleteField(),
  });
  await removeWorkoutRequestAlert(requesterId, workout);
};
export const acceptWorkoutRequest = async (requesterId, workout) => {
  await updateDoc(doc(db, "workouts", workout.id), {
    [`requests.${requesterId}`]: deleteField(),
    [`members.${requesterId}`]: true,
  });
  await updateDoc(doc(db, "users", requesterId), {
    [`workouts.${workout.id}`]: workout.startingTime,
  });
  await workoutRequestAcceptedAlert(requesterId, workout);
  await removeWorkoutRequestAlert(requesterId, workout);
};
export const rejectWorkoutRequest = async (requesterId, workout) => {
  await updateDoc(doc(db, "workouts", workout.id), {
    [`requests.${requesterId}`]: false,
  });
  await removeWorkoutRequestAlert(requesterId, workout);
};
export const getWorkout = async (workoutId) => {
  const workoutDoc = await getDoc(doc(db, "workouts", workoutId));
  return { ...workoutDoc.data(), id: workoutDoc.id };
};
export const getFriendsWorkouts = async (user) => {};
export const getPrivateChatByUsers = async (user, otherUser) => {
  const chatId = user.chatPals[otherUser.id];
  if (!chatId) {
    console.log("Havent found chatpal");
    return await getOrCreatePrivateChat(user, otherUser);
  } else {
    console.log("getting old chat");
    const chat = await getDoc(doc(db, `chats/${chatId}`));
    const chatWithId = { ...chat.data(), id: chat.id };
    return chatWithId;
  }
};
export const updateUser = async (user) => {
  await setDoc(doc(db, "users", user.id), { ...user });
};

export const addChatAlert = async (userId, chatId) => {
  await updateDoc(doc(db, "alerts", userId), {
    [`chats.${chatId}`]: increment(1),
  });
};
export const removeChatAlerts = async (userId, chatId) => {
  await updateDoc(doc(db, "alerts", userId), {
    [`chats.${chatId}`]: deleteField(),
  });
};
export const workoutRequestAlert = async (requesterId, workout) => {
  await updateDoc(doc(db, "alerts", workout.creator), {
    [`workoutRequests.${workout.id}.requests.${requesterId}`]: Timestamp.now(),
    [`workoutRequests.${workout.id}.workoutDate`]: workout.startingTime,
    [`workoutRequests.${workout.id}.requestsCount`]: increment(1),
  });
};
export const removeWorkoutRequestAlert = async (requesterId, workout) => {
  await updateDoc(doc(db, "alerts", workout.creator), {
    [`workoutRequests.${workout.id}.requests.${requesterId}`]: deleteField(),
    [`workoutRequests.${workout.id}.requestsCount`]: increment(-1),
  });
};
export const workoutInviteAlert = async (invitedId, workout) => {
  await updateDoc(doc(db, "alerts", invitedId), {
    [`workoutInvites.${workout.id}.workoutDate`]: workout.startingTime,
  });
};
export const removeWorkoutInviteAlert = async (invitedId, workout) => {
  await updateDoc(doc(db, "alerts", invitedId), {
    [`workoutInvites.${workout.id}`]: deleteField(),
  });
};
export const workoutRequestAcceptedAlert = async (requesterId, workout) => {
  await updateDoc(doc(db, "alerts", requesterId), {
    [`workoutRequestsAccepted.${workout.id}.acceptedDate`]: Timestamp.now(),
    [`workoutRequestsAccepted.${workout.id}.workoutDate`]: workout.startingTime,
  });
};
export const removeAllWorkoutRequestAcceptedAlerts = async (userId) => {
  await updateDoc(doc(db, "alerts", userId), {
    workoutRequestsAccepted: {},
  });
};
export const friendRequestAlert = async (senderId, receiverId) => {
  await updateDoc(doc(db, "alerts", receiverId), {
    [`friendRequests.${senderId}`]: Timestamp.now(),
  });
};
export const removeFriendRequestAlert = async (senderId, receiverId) => {
  await updateDoc(doc(db, "alerts", receiverId), {
    [`friendRequests.${senderId}`]: deleteField(),
  });
};
export const removeAllFriendRequestAlerts = async (userId) => {
  await updateDoc(doc(db, "alerts", userId), {
    friendRequests: {},
  });
};
export const getWorkoutsByInvites = async (invitesAlerts) => {
  //Array should look like this: [[34tt21ho,{workoutDate:2/1/2023}],[fkjs98,{workoutDate:3/1/2023}]]
  const invitesArray = Array.from(Object.entries(invitesAlerts)).sort(
    (a, b) => a[1].workoutDate.toDate() < b[1].workoutDate.toDate()
  );
  const returnedWorkouts = [];
  for (var invite of invitesArray) {
    const workout = await getWorkout(invite[0]);
    returnedWorkouts.push(workout);
  }
  return returnedWorkouts;
};
export const removePastOrEmptyWorkoutsAlerts = async (
  workoutRequestsAlerts,
  workoutRequestsAcceptedAlerts,
  workoutInvitesAlerts,
  userId
) => {
  const now = new Date();
  var changed = 0;
  const requestAlerts = workoutRequestsAlerts;
  for (var [key, value] of Object.entries(requestAlerts)) {
    if (value.workoutDate.toDate() < now || value.requestsCount == 0) {
      delete requestAlerts[key];
      changed++;
    }
  }
  const requestAcceptedAlerts = workoutRequestsAcceptedAlerts;
  for (var [key, value] of Object.entries(requestAcceptedAlerts)) {
    if (value.workoutDate.toDate() < now) {
      delete requestAcceptedAlerts[key];
      changed++;
    }
  }
  const inviteAlerts = workoutInvitesAlerts;
  for (var [key, value] of Object.entries(inviteAlerts)) {
    if (value.workoutDate.toDate() < now) {
      delete inviteAlerts[key];
      changed++;
    }
  }
  if (changed) {
    console.log(`Removed ${changed} old invites and request! enjoy your time`);
    await updateDoc(doc(db, "alerts", userId), {
      workoutRequests: requestAlerts,
      workoutRequestsAccepted: requestAcceptedAlerts,
      workoutInvites: inviteAlerts,
    });
  }
};
