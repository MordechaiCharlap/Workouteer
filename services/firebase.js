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
  orderBy,
  limit,
  arrayUnion,
  deleteDoc,
} from "firebase/firestore";
import { firebaseConfig } from "../firebase.config";
import { NativeModules, Platform } from "react-native";
export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
export const updateContext = async (userId) => {
  const updatedDoc = await getDoc(doc(db, "users", userId));
  return updatedDoc.data();
};
const getLanguage = () => {
  var language;
  if (Platform.OS == "android")
    language = NativeModules.I18nManager.localeIdentifier;
  else if (Platform.OS == "ios") {
    language =
      NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0];
  } else language = "en";
  if (language == "he" || language == "he-IL" || language == "heb")
    return "hebrew";
  else return "english";
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
  newShowOnline,
  language
) => {
  await updateDoc(doc(db, "users", userId), {
    isPublic: newIsPublic,
    showOnline: newShowOnline,
    language: language,
  });
};
export const searchUser = async (text) => {
  return await getDoc(doc(db, "users", text.toLowerCase()));
};
export const checkIfUsernameAvailable = async (username) => {
  const usernameRef = await getDoc(doc(db, "users", username));
  if (usernameRef.exists()) return false;
  else return true;
};
export const checkIfEmailAvailable = async (email) => {
  const q = query(
    collection(db, "users"),
    where("email", "==", email),
    limit(1)
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.size == 0) {
    return true;
  } else return false;
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
//depricated since there is no more personalData register-screen
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
  await setDoc(doc(db, "users", newUserData.id), {
    ...newUserData,
    friendsCount: 0,
    friendRequestsCount: 0,
    workouts: {},
    chatPals: {},
    friends: {},
    chats: {},
    description: "",
    language: getLanguage(),
    isPublic: true,
    showOnline: true,
    defaultCity: null,
    defaultCountry: null,
    isOnline: true,
    achievements: {},
    league: 0,
    leaderboard: {},
    streak: 0,
    totalPoints: 0,
  });

  await setDoc(doc(db, "alerts", newUserData.id), {
    chats: {},
    friendRequests: {},
    workoutInvites: {},
    workoutRequests: {},
    newWorkouts: {},
  });
  await setDoc(doc(db, "friendRequests", newUserData.id), {
    receivedRequests: {},
    sentRequests: {},
  });
};
export const checkFriendShipStatus = async (userData, otherUserId) => {
  if (userData.friends[otherUserId] != null) {
    return "Friends";
  } else {
    const friendRequests = (
      await getDoc(doc(db, "friendRequests", userData.id))
    ).data();
    if (friendRequests.sentRequests[otherUserId] != null) return "SentRequest";
    else if (friendRequests.receivedRequests[otherUserId] != null) {
      return "ReceivedRequest";
    } else return "None";
  }
};
export const getFriendRequests = async (userId) => {
  const returnedArray = [];
  const userRequests = await getDoc(doc(db, "friendRequests", userId));
  const receivedReqs = userRequests.data().receivedRequests;
  for (var [key, value] of Object.entries(receivedReqs)) {
    const user = await getDoc(doc(db, "users", key));
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
export const addChatConnection = async (userId, otherUserId, chatId) => {
  await updateDoc(doc(db, "users", userId), {
    [`chatPals.${otherUserId}`]: chatId,
    [`chats.${chatId}`]: Timestamp.now(),
  });
};
const getSeenByMapGroupChat = (senderId, chat) => {
  console.log(chat);
  var seenByMap = new Map();
  for (var key of Object.keys(chat.members)) {
    if (key != senderId) seenByMap.set(key, false);
  }

  return seenByMap;
};
export const getPrivateChatByUsers = async (user, otherUser) => {
  const chatId = user.chatPals[otherUser.id] || otherUser.chatPals[user.id];
  if (!chatId) {
    return;
  } else {
    const chat = await getChat(chatId);
    return {
      ...chat,
      id: chatId,
    };
  }
};
export const createNewPrivateChat = async (user, otherUser) => {
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
  return { id: chatRef.id, ...(await getChat(chatRef.id)) };
  // return { id: chatRef.id, ...chatRef.data() };
};
export const sendPrivateMessage = async (
  userId,
  otherUserId,
  content,
  chat
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
  for (var key of Object.keys(chat.members)) {
    if (key != userId) {
      await addChatAlert(key, chat.id);
    }
  }
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
  for (var chatId of Object.keys(user.chats)) {
    var chat = await getChat(chatId);
    var chatToPush = {
      chat: {
        id: chatId,
        ...chat,
      },
    };
    if (!chat.isGroupChat) {
      for (var key of Object.keys(chat.members)) {
        if (key != user.id) {
          chatToPush = {
            ...chatToPush,
            user: (await getDoc(doc(db, "users", key))).data(),
          };
        }
      }
    }
    chatsArr.push(chatToPush);
  }
  chatsArr.sort(
    (a, b) => b.chat.lastMessage.sentAt - a.chat.lastMessage.sentAt
  );
  return chatsArr;
};
export const getChat = async (chatId) => {
  return (await getDoc(doc(db, "chats", `${chatId}`))).data();
};
export const getFriendsArray = async (user) => {
  const friendsArr = [];
  for (var key of Object.keys(user.friends)) {
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
    if (!countryDoc.data().cities[city]) {
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
    [`workouts.${newWorkoutRef.id}`]: [
      workout.startingTime,
      workout.minutes,
      false,
    ],
  });
  await updateDoc(doc(db, "alerts", workout.creator), {
    [`newWorkouts.${newWorkoutRef.id}.dateAdded`]: Timestamp.now(),
    [`newWorkouts.${newWorkoutRef.id}.workoutDate`]: workout.startingTime,
  });
};
export const getFutureWorkouts = async (user, now) => {
  const workoutsArray = [];
  for (var [key, value] of Object.entries(user.workouts)) {
    if (value[0].toDate() > now) {
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
  for (var [key, value] of Object.entries(user.workouts)) {
    if (value[0].toDate() < now) {
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
const removeUserFromMembersOrDeleteGroupChat = async (user, chat) => {
  if (Object.keys(chat.members).length == 1) {
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
    [`chats.${chatAndUserItem.chat.id}`]: deleteField(),
  });
  //getting messages just after joinDate which is leaving date basically
  await updateDoc(doc(db, "chats", chatAndUserItem.chat.id), {
    [`members.${user.id}.joinDate`]: Timestamp.now(),
  });
  if (chatAlerts) {
    await removeChatAlerts(user.id, chatAndUserItem.chat);
  }
};
export const deleteGroupChatForUser = async (user, chat) => {
  await updateDoc(doc(db, "users", user.id), {
    [`chats.${chat.id}`]: deleteField(),
  });
  await removeUserFromMembersOrDeleteGroupChat(user, chatAndUserItem.chat);
};
export const cancelWorkout = async (user, workout) => {
  await updateDoc(doc(db, "users", user.id), {
    [`workouts.${workout.id}`]: deleteField(),
  });
  for (var [key, value] of Object.entries(workout.members)) {
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
  for (var key of Object.keys(countriesDoc.data().names)) {
    countriesArr.push({ label: key, value: key });
  }
  return countriesArr;
};

export const getCities = async (country) => {
  const citiesArr = [];
  const safeCountryString = country.replace(/\s/g, "-");
  const countryDoc = await getDoc(doc(db, "countriesData", safeCountryString));
  if (countryDoc.exists()) {
    for (var key of Object.keys(countryDoc.data().cities)) {
      citiesArr.push({ label: key, value: key });
    }
  }
  return citiesArr;
};
export const getWorkoutMembers = async (workout) => {
  const returnedMembersArr = [];
  returnedMembersArr.push(await getUserDataById(workout.creator));
  for (var key of Object.keys(workout.members)) {
    if (key != workout.creator)
      returnedMembersArr.push(await getUserDataById(key));
  }
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
export const acceptWorkoutInvite = async (
  invited,
  workout,
  scheduledNotificationId
) => {
  await updateDoc(doc(db, "workouts", workout.id), {
    [`invites.${invited.id}`]: deleteField(),
    [`members.${invited.id}`]: scheduledNotificationId,
  });
  await updateDoc(doc(db, "users", invited.id), {
    [`workouts.${workout.id}`]: workout.startingTime,
  });
  const accepted = true;
  await removeWorkoutInviteAlert(invited.id, workout, accepted);
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
export const acceptWorkoutRequest = async (requester, workout) => {
  await updateDoc(doc(db, "workouts", workout.id), {
    [`requests.${requester.id}`]: deleteField(),
    [`members.${requester.id}`]: {},
  });
  await updateDoc(doc(db, "users", requester.id), {
    [`workouts.${workout.id}`]: workout.startingTime,
  });
  await workoutRequestAcceptedAlert(requester.id, workout);
  await removeWorkoutRequestAlert(requester.id, workout);
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
export const removeWorkoutInviteAlert = async (
  invitedId,
  workout,
  accepted
) => {
  if (accepted != null) {
    await updateDoc(doc(db, "alerts", invitedId), {
      [`newWorkouts.${workout.id}.dateAdded`]: Timestamp.now(),
      [`newWorkouts.${workout.id}.workoutDate`]: workout.startingTime,
    });
  }
  await updateDoc(doc(db, "alerts", invitedId), {
    [`workoutInvites.${workout.id}`]: deleteField(),
  });
};
export const workoutRequestAcceptedAlert = async (requesterId, workout) => {
  await updateDoc(doc(db, "alerts", requesterId), {
    [`newWorkouts.${workout.id}.dateAdded`]: Timestamp.now(),
    [`newWorkouts.${workout.id}.workoutDate`]: workout.startingTime,
  });
};
export const removeAllWorkoutRequestAcceptedAlerts = async (userId) => {
  await updateDoc(doc(db, "alerts", userId), {
    newWorkouts: {},
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
  newWorkoutsAlerts,
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
  const requestAcceptedAlerts = newWorkoutsAlerts;
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
      newWorkouts: requestAcceptedAlerts,
      workoutInvites: inviteAlerts,
    });
  }
};
export const removeUnconfirmedOldWorkouts = async (user) => {
  const now = new Date();
  const userWorkouts = user.workouts;
  for (const [key, value] of Object.entries(user.workouts)) {
    if (
      new Date(value[0].toDate().getTime() + value[1] * 60000) < now &&
      !value[2]
    ) {
      delete userWorkouts[key];
      await deleteDoc(doc(db, `workouts/${key}`));
      console.log("Removed unconfirmed workout " + key);
    }
  }
  user.workouts = userWorkouts;
  await updateUser(user);
};
export const getLastWeekId = () => {
  const date = new Date();
  const lastSunday = new Date();
  lastSunday.setDate(date.getDate() - date.getDay());
  const weekId = `${lastSunday.getDate()}-${
    lastSunday.getMonth() + 1
  }-${lastSunday.getFullYear()}`;
  return weekId;
};
export const addLeaderboardPoints = async (user, pointsNumber) => {
  if (
    user.leaderboard.weekId != null &&
    user.leaderboard.weekId == getLastWeekId()
  ) {
    await updateDoc(
      doc(
        db,
        `leaderboards/${user.league}/${user.leaderboard.weekId}/${user.leaderboard.id}`
      ),
      {
        [`users.${user.id}.points`]: increment(pointsNumber),
        [`users.${user.id}.displayName`]: user.displayName,
        [`users.${user.id}.img`]: user.img,
      }
    );
  } else {
    await getNewLeaderboard(user, pointsNumber);
  }
};
const getNewLeaderboard = async (user, pointsNumber) => {
  const lastWeekId = getLastWeekId();
  var leaderboardId = "";
  const q = query(
    collection(db, `leaderboards/${user.league}/${lastWeekId}`),
    where("usersCount", "<", 50),
    limit(1)
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.size != 0) {
    leaderboardId = querySnapshot.docs[0].id;
    await updateDoc(
      doc(db, `leaderboards/${user.league}/${lastWeekId}/${leaderboardId}`),
      {
        [`users.${user.id}`]: {
          displayName: user.displayName,
          img: user.img,
          points: pointsNumber,
        },
        usersCount: increment(1),
      }
    );
  } else {
    const newLeaderboard = await addDoc(
      collection(db, `leaderboards/${user.league}/${lastWeekId}`),
      {
        users: {
          [user.id]: {
            displayName: user.displayName,
            img: user.img,
            points: pointsNumber,
          },
        },
        usersCount: increment(1),
      }
    );
    leaderboardId = newLeaderboard.id;
  }
  await updateDoc(doc(db, "users", user.id), {
    ["leaderboard.id"]: leaderboardId,
    ["leaderboard.weekId"]: lastWeekId,
  });
};
