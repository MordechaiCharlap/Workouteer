import { createContext, useContext, useEffect, useRef, useState } from "react";

const ProgramContext = createContext({});
export const WorkoutProgramProvider = ({ children }) => {
  const [programData, setProgramData] = useState();
  const [maximizedWorkout, setMaximizedWorkout] = useState(0);
  const [highlightErrors, setHighlightErrors] = useState(false);
  const workoutsFlatListRef = useRef();
  return (
    <ProgramContext.Provider
      value={{
        programData,
        setProgramData,
        maximizedWorkout,
        setMaximizedWorkout,
        highlightErrors,
        setHighlightErrors,
        workoutsFlatListRef,
      }}
    >
      {children}
    </ProgramContext.Provider>
  );
};
export default function useWorkoutProgram() {
  return useContext(ProgramContext);
}
