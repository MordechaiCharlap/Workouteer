import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import useAuth from "./useAuth";
import { onSnapshot, doc } from "firebase/firestore";
import * as firebase from "../services/firebase";
import useFirebase from "./useFirebase";
const AlertsContext = createContext({});
export const AlertsProvider = ({ children }) => {
  const { db } = useFirebase();
  const { user, userLoaded } = useAuth();
  const [chatsAlerts, setChatsAlerts] = useState({});
  const [workoutRequestsAlerts, setWorkoutRequestsAlerts] = useState({});
  const [workoutInvitesAlerts, setWorkoutInvitesAlerts] = useState({});
  const [friendRequestsAlerts, setFriendRequestsAlerts] = useState({});
  const [newWorkoutsAlerts, setNewWorkoutsAlerts] = useState({});
  const unsubscribeAlerts = useRef();
  const cleanAlertsListener = () => {
    if (unsubscribeAlerts.current != null) {
      unsubscribeAlerts.current();
      unsubscribeAlerts.current = null;

      setWorkoutRequestsAlerts({});
      setFriendRequestsAlerts({});
      setWorkoutInvitesAlerts({});
      setChatsAlerts({});
      setNewWorkoutsAlerts({});
    }
  };
  useEffect(() => {
    if (userLoaded) {
      unsubscribeAlerts.current = onSnapshot(
        doc(db, "alerts", user.id),
        (doc) => {
          if (doc.exists()) {
            const alertsData = doc.data();
            setChatsAlerts(alertsData.chats);
            setWorkoutRequestsAlerts(alertsData.workoutRequests);
            setWorkoutInvitesAlerts(alertsData.workoutInvites);
            setFriendRequestsAlerts(alertsData.friendRequests);
            setNewWorkoutsAlerts(alertsData.newWorkouts);
            firebase.removePastOrEmptyWorkoutsAlerts(
              alertsData.workoutRequests,
              alertsData.newWorkouts,
              alertsData.workoutInvites,
              user.id
            );
          }
        }
      );
    } else {
      cleanAlertsListener();
    }
    return () => {
      cleanAlertsListener();
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
        cleanAlertsListener,
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
};
export default function useAlerts() {
  return useContext(AlertsContext);
}
