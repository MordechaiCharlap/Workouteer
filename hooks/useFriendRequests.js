import { createContext, useContext, useEffect, useState } from "react";
import useAuth from "./useAuth";
import useFirebase from "./useFirebase";
import { doc, onSnapshot } from "firebase/firestore";

const FriendRequestsContext = createContext({});
export const FriendRequestsProvider = ({ children }) => {
  const { user, userLoaded } = useAuth();
  const { db } = useFirebase();
  const [sentFriendRequests, setSentFriendRequests] = useState();
  const [receivedFriendRequests, setReceivedFriendRequests] = useState();
  useEffect(() => {
    if (!userLoaded) return;
    onSnapshot(doc(db, "friendRequests", user.id), (doc) => {
      setSentFriendRequests(doc.data().sentRequests);
      setReceivedFriendRequests(doc.data().receivedRequests);
    });
  }, [userLoaded]);

  return (
    <FriendRequestsContext.Provider
      value={{ sentFriendRequests, receivedFriendRequests }}
    >
      {children}
    </FriendRequestsContext.Provider>
  );
};
export default function useFriendRequests() {
  return useContext(FriendRequestsContext);
}
