import React from "react";
import { createContext, useContext } from "react";
import * as firebase from "../services/firebase";
import { useEffect, useState } from "react";
const AlertsContext = createContext({});
export const AuthPrvider = ({ children }) => {
  return <AlertsContext.Provider value={{}}>{children}</AlertsContext.Provider>;
};
export default function useAlerts() {
  return useContext(AlertsContext);
}
