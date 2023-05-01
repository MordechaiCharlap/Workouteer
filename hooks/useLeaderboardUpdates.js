import { useEffect, createContext, useContext } from "react";
import useAuth from "./useAuth";
const LeaderboardUpdatesContext = createContext({});
const LeaderboardUpdatesProvider = (children) => {
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
export const useLeaderboardUpdatesProvider = useContext(
  LeaderboardUpdatesContext
);
