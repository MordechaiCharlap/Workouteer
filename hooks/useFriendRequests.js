import { createContext, useContext, useEffect, useRef, useState } from "react";
import useAuth from "./useAuth";
import useFirebase from "./useFirebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

const FriendRequestsContext = createContext({});
export const FriendRequestsProvider = ({ children }) => {
  const { user, userLoaded } = useAuth();
  const { db } = useFirebase();
  const [sentFriendRequests, setSentFriendRequests] = useState({});
  const [receivedFriendRequests, setReceivedFriendRequests] = useState({});
  const listener = useRef();
  const cleanFriendRequestsListener = () => {
    if (listener.current) listener.current();
    listener.current = null;
  };
  useEffect(() => {
    if (userLoaded)
      listener.current = onSnapshot(
        doc(db, "friendRequests", user.id),
        (docSnap) => {
          if (docSnap.exists()) {
            setSentFriendRequests(docSnap.data().sentRequests);
            setReceivedFriendRequests(docSnap.data().receivedRequests);
          } else {
            setDoc(doc(db, "friendRequests", user.id), {
              receivedRequests: {},
              sentRequests: {},
            });
          }
        }
      );
    else {
      cleanFriendRequestsListener();
    }
    return () => {
      cleanFriendRequestsListener();
    };
  }, [userLoaded]);

  return (
    <FriendRequestsContext.Provider
      value={{
        sentFriendRequests,
        receivedFriendRequests,
        cleanFriendRequestsListener,
      }}
    >
      {children}
    </FriendRequestsContext.Provider>
  );
};
export default function useFriendRequests() {
  return useContext(FriendRequestsContext);
}
