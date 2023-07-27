import { createContext, useContext, useEffect, useState } from "react";
import useAuth from "./useAuth";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import useFirebase from "./useFirebase";
import { getUserDataById } from "../services/firebase";
import useAppData from "./useAppData";

const ExploreContext = createContext({});
export const ExploreProvider = ({ children }) => {
  const { user, userLoaded } = useAuth();
  const { db } = useFirebase();
  const [latestWorkouts, setLatestWorkouts] = useState();
  const [SuggestedUsers, setSuggestedUsers] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const { usersData } = useAppData();
  useEffect(() => {
    if (!userLoaded) return;
    getSuggestedUsers();
  }, [userLoaded]);
  const getSuggestedUsers = async () => {
    const suggestedArray = [];
    const suggestedCounterMap = {};
    for (var friendId of Object.keys(user.friends)) {
      const friendData = await getUserDataById(friendId);
      for (var friendsFriendId of Object.keys(friendData.friends)) {
        if (friendsFriendId == user.id || user.friends[friendsFriendId] != null)
          continue;
        suggestedCounterMap[friendsFriendId] =
          suggestedCounterMap[friendsFriendId] == null
            ? 1
            : suggestedCounterMap[friendsFriendId] + 1;
      }
    }
    const suggestedCounterArray = Object.entries(suggestedCounterMap).map(
      ([id, mutualFriendsCount]) => ({
        id,
        mutualFriendsCount,
      })
    );
    suggestedCounterArray.sort(
      (a, b) => b.mutualFriendsCount - a.mutualFriendsCount
    );
    for (var suggestedFriend of suggestedCounterArray.slice(0, 10)) {
      suggestedArray.push({
        mutualFriendsCount: suggestedFriend.mutualFriendsCount,
        ...(await getUserDataById(suggestedFriend.id)),
      });
    }
    if (suggestedArray.length < 10) {
      var usersLeftToFillListCount = 10 - suggestedArray.length;
      for (var randomUserId of usersData.allUsersIds) {
        if (usersLeftToFillListCount == 0) break;
        if (
          randomUserId == user.id ||
          // user.friends[randomUserId] != null ||
          suggestedArray.findIndex(
            (suggestedFriend) => suggestedFriend.id == randomUserId
          ) != -1
        ) {
          continue;
        } else {
          suggestedArray.push(await getUserDataById(randomUserId));
          usersLeftToFillListCount -= 1;
        }
      }
    }
    setSuggestedUsers(suggestedArray);
  };
  const refreshLatestWorkouts = () => {
    setRefreshing(true);
    const data = [];
    const q = query(
      collection(db, "workouts"),
      where("confirmed", "==", true),
      orderBy("startingTime", "desc"),
      limit(10)
    );
    getDocs(q).then((snapshot) => {
      snapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id });
      });
      setLatestWorkouts(data);
      setRefreshing(false);
    });
  };
  return (
    <ExploreContext.Provider
      value={{
        latestWorkouts,
        SuggestedUsers,
        refreshLatestWorkouts,
        refreshing,
      }}
    >
      {children}
    </ExploreContext.Provider>
  );
};
export default function useExplore() {
  return useContext(ExploreContext);
}
