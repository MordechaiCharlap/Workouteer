import { createContext, useContext, useState } from "react";
import AwesomeModal from "../components/AwesomeModal";
import languageService from "../services/languageService";
import useAuth from "./useAuth";
import { useNavigation } from "@react-navigation/native";
import { useRef } from "react";
import { useEffect } from "react";
import { getWorkout } from "../services/firebase";

const WorkoutLogicContext = createContext({});
export const WorkoutLogicProvider = ({ children }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const overlappedWorkoutId = useRef();
  useEffect(() => {
    //resetting the overlapped id
    if (!showModal) overlappedWorkoutId.current = null;
  }, [showModal]);
  const checkIfWorkoutOnPlannedWorkoutTime = (user, workout) => {
    var closestWorkoutAfter = null;
    for (var [key, value] of Object.entries(user?.plannedWorkouts)) {
      if (
        new Date(value[0].toDate().getTime() + value[1] * 60000) >
          workout.startingTime.toDate() &&
        value[0].toDate() < workout.startingTime.toDate()
      ) {
        overlappedWorkoutId.current = key;
        setShowModal(true);
        return key;
      } else if (
        value[0].toDate() > workout.startingTime.toDate() &&
        (closestWorkoutAfter == null ||
          value[0].toDate() < closestWorkoutAfter?.startingTime)
      )
        closestWorkoutAfter = { id: key, startingTime: value[0].toDate() };
    }
    if (
      closestWorkoutAfter != null &&
      new Date(workout.startingTime.toDate().getTime() + minutes * 60000) >
        closestWorkoutAfter.startingTime
    ) {
      setShowModal(true);
      overlappedWorkoutId.current = closestWorkoutAfter.id;
      return closestWorkoutAfter.id;
    }
    return null;
  };
  const showPlannedWorkout = async () => {
    const workout = await getWorkout(overlappedWorkoutId.current);
    if (workout)
      navigation.navigate("WorkoutDetails", {
        workout: workout,
        isPastWorkout: false,
      });
    setShowModal(false);
  };
  return (
    <WorkoutLogicContext.Provider
      value={{ checkIfWorkoutOnPlannedWorkoutTime }}
    >
      {children}
      {user && (
        <AwesomeModal
          setShowModal={setShowModal}
          showModal={showModal}
          confirmText={languageService[user.language].showPlannedWorkout}
          cancelText={languageService[user.language].gotIt}
          onConfirmPressed={showPlannedWorkout}
          title={
            languageService[user.language].youCannotJoinThisWorkout[
              user.isMale ? 1 : 0
            ]
          }
          message={
            languageService[user.language].thisWorkoutOverlapsPlannedWorkout
          }
          onCancelPressed={() => setShowModal(false)}
          showCancelButton={true}
        />
      )}
    </WorkoutLogicContext.Provider>
  );
};
export const useWorkoutLogic = () => useContext(WorkoutLogicContext);
