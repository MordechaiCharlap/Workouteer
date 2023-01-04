import React, { createContext, useContext, useEffect, useState } from "react";
const AlertsContext = createContext({});
export const AlertsProvider = ({ children }) => {
  const [chatAlerts, setChatAlerts] = useState(false);
  const [workoutRequestsAlerts, setWorkoutRequestsAlerts] = useState(false);
  const [workoutInvitesAlerts, setWorkoutInvitesAlerts] = useState(false);
  const [friendRequestsAlerts, setFriendRequestsAlerts] = useState(false);
  return (
    <AlertsContext.Provider
      value={{
        chatAlerts,
        setChatAlerts,
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
