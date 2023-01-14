import React, { createContext, useContext, useEffect, useState } from "react";
const AlertsContext = createContext({});
export const AlertsProvider = ({ children }) => {
  const [chatsAlerts, setChatsAlerts] = useState({});
  const [workoutRequestsAlerts, setWorkoutRequestsAlerts] = useState({});
  const [workoutInvitesAlerts, setWorkoutInvitesAlerts] = useState({});
  const [friendRequestsAlerts, setFriendRequestsAlerts] = useState({});
  const [newWorkoutsAlerts, setNewWorkoutsAlerts] = useState({});
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
