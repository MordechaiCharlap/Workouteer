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
import { color_primary } from "../utilities/appStyleSheet";
const LeaderboardUpdatesContext = createContext({});
export const LeaderboardUpdatesProvider = ({ children }) => {
  const { user } = useAuth();
  const [modalTitle, setModalTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [testing, setTesting] = useState(true);
  const getPlaceString = (place, language) => {
    if (language == "english") {
      return `${place} ${languageService[language].place}`;
    }
    return languageService[language].place + " " + place;
  };
  useEffect(() => {
    // if (!user?.leaderboard.leaderboardUpdatedMessage) return;
    if (!user) return;
    const leaderboardUpdated = testing
      ? { lastPlace: 1 }
      : user.leaderboard.leaderboardUpdated;
    console.log("Showing leaderboard updated modal!");
    setTesting(true);
    setModalTitle(
      languageService[user.language].youFinished[user.isMale ? 1 : 0] +
        " " +
        getPlaceString(leaderboardUpdated.lastPlace, user.language) +
        " " +
        languageService[user.language].lastWeekend
    );
    setShowModal(true);
  }, [user]);
  return (
    <LeaderboardUpdatesContext.Provider value={{}}>
      {children}
      {showModal && (
        <AwesomeAlert
          overlayStyle={color_primary}
          show={showModal}
          showProgress={false}
          title={modalTitle}
          message={""}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showConfirmButton={true}
          confirmText={languageService[user.language].gotIt}
          confirmButtonColor={color_primary}
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
