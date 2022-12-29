import React, { createContext, useContext, useEffect } from "react";
import * as firebase from "../services/firebase";
const AlertsContext = createContext({});
export const AuthPrvider = ({ children }) => {
  return (
    <AlertsContext.Provider value={{ test: "test" }}>
      {children}
    </AlertsContext.Provider>
  );
};
export default function useAlerts() {
  return useContext(AlertsContext);
}
