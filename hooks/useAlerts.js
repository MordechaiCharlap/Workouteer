import React, { createContext, useContext, useEffect, useState } from "react";
import useAuth from "./useAuth";
import { onSnapshot, doc } from "firebase/firestore";
import * as firebase from "../services/firebase";
const AlertsContext = createContext({});
export const AlertsProvider = ({ children }) => {
  const { user, userLoaded } = useAuth();
  const [chatsAlerts, setChatsAlerts] = useState({});
  const [workoutRequestsAlerts, setWorkoutRequestsAlerts] = useState({});
  const [workoutInvitesAlerts, setWorkoutInvitesAlerts] = useState({});
  const [friendRequestsAlerts, setFriendRequestsAlerts] = useState({});
  const [newWorkoutsAlerts, setNewWorkoutsAlerts] = useState({});

  const [unsubscribeAlerts, setUnsubscribeAlerts] = useState();
  useEffect(() => {
    const removingBadWorkoutAlerts = async () => {
      await firebase.removePastOrEmptyWorkoutsAlerts(
        workoutRequestsAlerts,
        newWorkoutsAlerts,
        workoutInvitesAlerts,
        user.id
      );
    };
    if (userLoaded) {
      removingBadWorkoutAlerts();
      setUnsubscribeAlerts(
        onSnapshot(doc(firebase.db, "alerts", user.id), (doc) => {
          const alertsData = doc.data();
          if (alertsData != null) {
            setChatsAlerts(alertsData.chats);
            setWorkoutRequestsAlerts(alertsData.workoutRequests);
            setWorkoutInvitesAlerts(alertsData.workoutInvites);
            setFriendRequestsAlerts(alertsData.friendRequests);
            setNewWorkoutsAlerts(alertsData.newWorkouts);
          }
        })
      );
    } else {
      if (unsubscribeAlerts != null) {
        unsubscribeAlerts();
        setUnsubscribeAlerts(null);
      }
    }
    return () => {
      if (unsubscribeAlerts != null) {
        unsubscribeAlerts();
        setUnsubscribeAlerts(null);
      }
    };
  }, [userLoaded]);
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
