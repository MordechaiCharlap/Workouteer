import { useEffect, createContext, useContext, useState } from "react";
import { Modal, Text, View } from "react-native";

import useAuth from "./useAuth";
const LeaderboardUpdatesContext = createContext({});
export const LeaderboardUpdatesProvider = (children) => {
  const { user } = useAuth();
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    const leaderboardUpdated = user.leaderboard.leaderboardUpdated;
    if (user.leaderboard.leaderboardUpdated != null) {
      setModalMessage(
        `You finished ${leaderboardUpdated.lastPlace} place last weekend`
      );
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [user.leaderboard.leaderboardUpdatedMessage]);
  return (
    <LeaderboardUpdatesContext.Provider value={{}}>
      {children}
      {showModal && (
        <Modal
          visible={showModal}
          transparent={true}
          onRequestClose={() => setShowModal(false)}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <View style={{ backgroundColor: "#fff", padding: 20 }}>
              <Text>{modalMessage}</Text>
            </View>
          </View>
        </Modal>
      )}
    </LeaderboardUpdatesContext.Provider>
  );
};
export default function useLeaderboardUpdates() {
  return useContext(LeaderboardUpdatesContext);
}
