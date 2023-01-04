import React, { createContext, useContext, useEffect, useState } from "react";
const AlertsContext = createContext({});
export const AlertsProvider = ({ children }) => {
  const [chatsAlerts, setChatsAlerts] = useState(false);
  const [workoutRequestsAlerts, setWorkoutRequestsAlerts] = useState(false);
  const [workoutInvitesAlerts, setWorkoutInvitesAlerts] = useState(false);
  const [friendRequestsAlerts, setFriendRequestsAlerts] = useState(false);
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
      }}
    >
      {children}
    </AlertsContext.Provider>
  );
};
export default function useAlerts() {
  return useContext(AlertsContext);
}
