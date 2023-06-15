import { createContext, useContext, useEffect, useState } from "react";

const FirebaseContext = createContext({});
export const FirebaseProvider = ({ children }) => {
  const [firestore, setFirestore] = useState();
  const [storage, setStorage] = useState();
  const [auth, setAuth] = useState();
  useEffect(() => {}, []);
  return (
    <FirebaseContext.Provider value={{}}>{children}</FirebaseContext.Provider>
  );
};
export default function useFirebase() {
  return useContext(FirebaseContext);
}
