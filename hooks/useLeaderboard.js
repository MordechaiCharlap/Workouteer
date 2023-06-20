import { useEffect, createContext, useContext, useState, useRef } from "react";
import languageService from "../services/languageService";
import useAuth from "./useAuth";
import AwesomeAlert from "react-native-awesome-alerts";
import { color_primary } from "../utilities/appStyleSheet";
import * as firebase from "../services/firebase";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import useFirebase from "./useFirebase";
const LeaderboardContext = createContext({});
export const LeaderboardProvider = ({ children }) => {
  const { user, userLoaded } = useAuth();
  const [modalTitle, setModalTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [testing, setTesting] = useState(false);
  const [leaderboardList, setLeaderboardList] = useState();
  const { db } = useFirebase();
  const unsubscribeLeaderboard = useRef();
  const cleanListener = () => {
    if (unsubscribeLeaderboard.current) {
      unsubscribeLeaderboard.current();
      unsubscribeLeaderboard.current = null;
    }
  };
  useEffect(() => {
    const updateUserPointsDoc = async () => {
      const userClone = { ...user };
      const userIndex = leaderboardList.findIndex(
        (element) => element[0] == user.id
      );
      userClone.leaderboard.points = leaderboardList[userIndex][1].points;
      await firebase.updateUser(userClone);
    };
    if (leaderboardList != null && user.leaderboard.points == null) {
      updateUserPointsDoc();
    }
  }, [leaderboardList]);
  useEffect(() => {
    const listenToLeaderboard = async () => {
      unsubscribeLeaderboard.current = onSnapshot(
        doc(
          db,
          `leaderboards/${user.league}/${user.leaderboard.weekId}/${user.leaderboard.id}`
        ),
        (doc) => {
          const leaderboardData = doc.data();

          const usersArray = Array.from(
            Object.entries(leaderboardData.users)
          ).sort((a, b) => b[1].points - a[1].points);
          setLeaderboardList(usersArray);
        }
      );
    };
    if (
      user?.leaderboard?.points != 0 &&
      userLoaded &&
      !unsubscribeLeaderboard.current
    ) {
      listenToLeaderboard();
    } else {
      cleanListener();
    }
    return () => cleanListener();
  }, [user?.leaderboard?.points, userLoaded]);
  const getPlaceString = (place, language) => {
    if (language == "english") {
      return `${place} ${languageService[language].place}`;
    }
    return languageService[language].place + " " + place;
  };
  useEffect(() => {
    if (!userLoaded) return;
    const getNewLeaderboard = async () => {
      await firebase.getNewLeaderboard(user, 0);
    };
    if (firebase.getLastWeekId() != user.leaderboard.weekId) {
      getNewLeaderboard();
    }
  }, [userLoaded]);
  useEffect(() => {
    if (!user?.leaderboard?.leaderboardUpdated) return;
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
  }, [user?.leaderboard?.leaderboardUpdated]);
  return (
    <LeaderboardContext.Provider value={{ leaderboardList }}>
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
    </LeaderboardContext.Provider>
  );
};
export default function useLeaderboard() {
  return useContext(LeaderboardContext);
}
