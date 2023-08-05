import { createContext, useContext, useEffect, useState } from "react";
import useAuth from "./useAuth";
import useFirebase from "./useFirebase";
import { doc, onSnapshot } from "firebase/firestore";

const FriendRequestsContext = createContext({});
export const FriendRequestsProvider = ({ children }) => {
  const { user, userLoaded } = useAuth();
  const { db } = useFirebase();
  const [friendRequestsSent, setFriendRequestsSent] = useState();
  const [friendRequestsReceived, setFriendRequestsReceived] = useState();
  useEffect(() => {
    if (!userLoaded) return;
    onSnapshot(doc(db, "friendRequests", user.id), (doc) => {
      setFriendRequestsSent(doc.data().friendRequestsSent);
      setFriendRequestsReceived(doc.data().friendRequestsReceived);
      console.log(doc.data());
    });
  }, [userLoaded]);

  return (
    <FriendRequestsContext.Provider
      value={{ friendRequestsSent, friendRequestsReceived }}
    >
      {children}
    </FriendRequestsContext.Provider>
  );
};
export default useFriendRequests = () => {
  return useContext(FriendRequestsContext);
};
