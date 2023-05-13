import { useContext, useEffect } from "react";
import useAuth from "./useAuth";
import { useRef } from "react";
import { db } from "../services/firebase";
import { onSnapshot } from "firebase/firestore";
import { useState } from "react";
const { createContext } = require("react");

const PlacesContext = createContext({});
export const PlacesProvider = ({ children }) => {
  const unsubscribeRef = useRef();
  const { userLoaded, user } = useAuth();
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    if (userLoaded) {
      unsubscribeRef.current = onSnapshot(
        doc(db, "countriesData", "countries"),
        (doc) => {
          setCountries(Array.from(Object.entries(doc.data().names)));
        }
      );
    } else {
    }
  }, [userLoaded]);
  return <PlacesContext.Provider value={{}}>{children}</PlacesContext.Provider>;
};
export default usePlaces = () => useContext(PlacesContext);
