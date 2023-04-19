import React, { createContext, useContext, useEffect, useState } from "react";
import useAuth from "./useAuth";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../services/firebase";
const AlertsContext = createContext({});
export const AlertsProvider = ({ children }) => {
  const { user } = useAuth();
  const [userSignedIn, setUserSignedIn] = useState(false);
  const [chatsAlerts, setChatsAlerts] = useState({});
  const [workoutRequestsAlerts, setWorkoutRequestsAlerts] = useState({});
  const [workoutInvitesAlerts, setWorkoutInvitesAlerts] = useState({});
  const [friendRequestsAlerts, setFriendRequestsAlerts] = useState({});
  const [newWorkoutsAlerts, setNewWorkoutsAlerts] = useState({});
  var unsubscribeAlerts = null;
  useEffect(() => {
    if (user) {
      if (!userSignedIn) {
        console.log("Listening to alerts");
        console.log(user.id);
        setUserSignedIn(true);
        unsubscribeAlerts = onSnapshot(doc(db, "alerts", user.id), (doc) => {
          const alertsData = doc.data();
          setChatsAlerts(alertsData.chats);
          setWorkoutRequestsAlerts(alertsData.workoutRequests);
          setWorkoutInvitesAlerts(alertsData.workoutInvites);
          setFriendRequestsAlerts(alertsData.friendRequests);
          setNewWorkoutsAlerts(alertsData.newWorkouts);
        });
      }
    } else {
      if (userSignedIn) {
        setUserSignedIn(false);
        if (unsubscribeAlerts != null) {
          console.log("Stopped listening to alerts");
          unsubscribeAlerts();
        }
      }
    }
  }, [user]);
  return (
    <AlertsContext.Provider
      value={{
        chatsAlerts,
        setChatsAlerts,
        workoutRequestsAlerts,
        setWorkoutRequestsAlerts,
        workoutInvitesAlerts,
        setWorkoutInvitesAlerts,
        friendRequestsAlerts,
        setFriendRequestsAlerts,
        newWorkoutsAlerts,
        setNewWorkoutsAlerts,
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
};
export default function useAlerts() {
  return useContext(AlertsContext);
}
