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
        setUserSignedIn(true);
        unsubscribeAlerts = onSnapshot(doc(db, "alerts", user.id), (doc) => {
          const alertsData = doc.data();
          if (alertsData != null) {
            setChatsAlerts(alertsData.chats);
            setWorkoutRequestsAlerts(alertsData.workoutRequests);
            setWorkoutInvitesAlerts(alertsData.workoutInvites);
            setFriendRequestsAlerts(alertsData.friendRequests);
            setNewWorkoutsAlerts(alertsData.newWorkouts);
          }
        });
      }
    } else {
      if (userSignedIn) {
        setUserSignedIn(false);
        if (unsubscribeAlerts != null) {
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
