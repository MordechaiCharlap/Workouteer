import { useEffect, createContext, useContext } from "react";
import useAuth from "./useAuth";
const LeaderboardUpdatesContext = createContext({});
export const LeaderboardUpdatesProvider = (children) => {
  const { user } = useAuth();
  useEffect(() => {
    if (leaderboardUpdatedMessage != null) {
    }
  }, [user.leaderboard.leaderboardUpdatedMessage]);
  return (
    <LeaderboardUpdatesContext.Provider value={{}}>
      {children}
    </LeaderboardUpdatesContext.Provider>
  );
};
export default function useLeaderboardUpdates() {
  return useContext(LeaderboardUpdatesContext);
}
