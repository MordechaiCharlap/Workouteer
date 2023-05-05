import { useEffect, createContext, useContext, useState } from "react";
import languageService from "../services/languageService";
import useAuth from "./useAuth";
import AwesomeAlert from "react-native-awesome-alerts";
import { color_primary } from "../utilities/appStyleSheet";
import * as firebase from "../services/firebase";
const LeaderboardUpdatesContext = createContext({});
export const LeaderboardUpdatesProvider = ({ children }) => {
  const { user } = useAuth();
  const [modalTitle, setModalTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [testing, setTesting] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const getPlaceString = (place, language) => {
    if (language == "english") {
      return `${place} ${languageService[language].place}`;
    }
    return languageService[language].place + " " + place;
  };
  useEffect(() => {
    if (!user) setUserLoggedIn(false);
    else {
      if (!userLoggedIn) {
        setUserLoggedIn(true);
        const getNewLeaderboard = async () => {
          await firebase.getNewLeaderboard(user, 0);
          console.log("getting new leaderboard");
        };
        if (firebase.getLastWeekId() != user.leaderboard.weekId) {
          getNewLeaderboard();
        }
      }
    }
  }, [user]);
  useEffect(() => {
    // if (!user?.leaderboard.leaderboardUpdatedMessage) return;
    if (!user) return;
    const leaderboardUpdated = testing
      ? { lastPlace: 1 }
      : user.leaderboard.leaderboardUpdated;
    if (leaderboardUpdated != null) {
      setModalTitle(
        languageService[user.language].youFinished[user.isMale ? 1 : 0] +
          " " +
          getPlaceString(leaderboardUpdated.lastPlace, user.language) +
          " " +
          languageService[user.language].lastWeekend
      );
      setShowModal(true);
    }
  }, [user]);
  return (
    <LeaderboardUpdatesContext.Provider value={{}}>
      {children}
      {showModal && (
        <AwesomeAlert
          show={showModal}
          showProgress={false}
          title={modalTitle}
          message={""}
          closeOnTouchOutside={true}
          onDismiss={() => setShowModal(false)}
          closeOnHardwareBackPress={true}
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
