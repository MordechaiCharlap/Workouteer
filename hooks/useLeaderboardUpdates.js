import { useEffect, createContext, useContext, useState } from "react";
import {
  Modal,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import languageService from "../services/languageService";
import useAuth from "./useAuth";
import AwesomeAlert from "react-native-awesome-alerts";
const LeaderboardUpdatesContext = createContext({});
export const LeaderboardUpdatesProvider = ({ children }) => {
  const { user } = useAuth();
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [testing, setTesting] = useState(true);
  useEffect(() => {
    // if (!user?.leaderboard.leaderboardUpdatedMessage) return;
    if (!user) return;
    const leaderboardUpdated = testing
      ? { lastPlace: 1 }
      : user.leaderboard.leaderboardUpdated;
    console.log("Showing leaderboard updated modal!");
    setTesting(true);
    setModalMessage(
      `You finished ${leaderboardUpdated.lastPlace} place last weekend`
    );
    setShowModal(true);
  }, [user?.leaderboard.leaderboardUpdated]);
  return (
    <LeaderboardUpdatesContext.Provider value={{}}>
      {children}
      {showModal && (
        <AwesomeAlert
          show={showModal}
          showProgress={false}
          title={modalMessage}
          message={modalMessage}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText={languageService[user.language].gotIt}
          confirmButtonColor="#DD6B55"
          onCancelPressed={() => {
            setShowAlert(false);
          }}
          onConfirmPressed={() => {
            setShowAlert(false);
          }}
        />
      )}
    </LeaderboardUpdatesContext.Provider>
  );
};
export default function useLeaderboardUpdates() {
  return useContext(LeaderboardUpdatesContext);
}
