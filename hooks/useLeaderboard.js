import { useEffect, createContext, useContext, useState, useRef } from "react";
import languageService from "../services/languageService";
import useAuth from "./useAuth";
import AwesomeAlert from "react-native-awesome-alerts";
import { color_on_surface, color_surface } from "../utils/appStyleSheet";
import * as firebase from "../services/firebase";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import useFirebase from "./useFirebase";
import CustomModal from "../components/basic/CustomModal";
import useAlerts from "./useAlerts";
import CustomText from "../components/basic/CustomText";
import CustomButton from "../components/basic/CustomButton";
import { getLastWeekId } from "../utils/leaderboardUtils";
const LeaderboardContext = createContext({});
export const LeaderboardProvider = ({ children }) => {
  const { user, userLoaded } = useAuth();
  const [leaderboardList, setLeaderboardList] = useState();
  const { db } = useFirebase();
  const unsubscribeLeaderboard = useRef();
  const cleanLeaderboardListener = () => {
    if (unsubscribeLeaderboard.current != null) {
      unsubscribeLeaderboard.current();
      unsubscribeLeaderboard.current = null;

      setLeaderboardList(null);
    }
  };
  useEffect(() => {
    const listenToLeaderboard = () => {
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
      user &&
      user.leaderboard?.id &&
      user.leaderboard.points != 0 &&
      user.leaderboard.points != null &&
      userLoaded &&
      !unsubscribeLeaderboard.current
    ) {
      listenToLeaderboard();
    } else {
      cleanLeaderboardListener();
    }
    return () => {
      cleanLeaderboardListener();
    };
  }, [user?.leaderboard, userLoaded]);
  useEffect(() => {
    if (!userLoaded || getLastWeekId() == user?.leaderboard?.weekId) return;
    firebase.getNewLeaderboard(user, 0);
  }, [userLoaded]);
  return (
    <LeaderboardContext.Provider
      value={{ leaderboardList, cleanLeaderboardListener }}
    >
      {children}
      <NewLeaderboardModal />
    </LeaderboardContext.Provider>
  );
};
export default function useLeaderboard() {
  return useContext(LeaderboardContext);
}
const NewLeaderboardModal = () => {
  const { user } = useAuth();
  const { newLeaderboardAlert, setNewLeaderboardAlert } = useAlerts();
  const [showModal, setShowModal] = useState(false);
  const { db } = useFirebase();
  useEffect(() => {
    if (!newLeaderboardAlert || Object.keys(newLeaderboardAlert).length == 0)
      return;
    setShowModal(true);
  }, [newLeaderboardAlert]);
  useEffect(() => {
    if (
      !showModal &&
      newLeaderboardAlert &&
      Object.keys(newLeaderboardAlert).length != 0
    )
      updateDoc(doc(db, `alerts/${user.id}`), { newLeaderboard: {} });
  }, [showModal]);
  return (
    showModal && (
      <CustomModal
        style={{ alignItems: "center", rowGap: 10 }}
        closeOnTouchOutside
        showModal={showModal}
        setShowModal={setShowModal}
      >
        <CustomText
          style={{ fontWeight: 700, fontSize: 25, textAlign: "center" }}
        >
          {languageService[user.language].lastLeaderboardResults + ":"}
        </CustomText>
        <CustomText style={{ fontWeight: 500, fontSize: 18 }}>
          {newLeaderboardAlert.lastPoints != 0 &&
            newLeaderboardAlert.lastPlace <= 10 &&
            languageService[user.language].congratulations + "! "}
          {languageService[user.language].newLeaderboardMessage(
            newLeaderboardAlert
          )}
        </CustomText>
        <CustomButton
          onPress={() => setShowModal(false)}
          round
          style={{ backgroundColor: color_on_surface, width: "100%" }}
        >
          <CustomText style={{ color: color_surface }}>
            {languageService[user.language].exit}
          </CustomText>
        </CustomButton>
      </CustomModal>
    )
  );
};
