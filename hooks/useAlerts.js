import React, { createContext, useContext, useEffect, useState } from "react";
import useAuth from "./useAuth";
const AlertsContext = createContext({});
export const AlertsProvider = ({ children }) => {
  return (
    <AlertsContext.Provider
      value={{}}
    >
      {children}
    </AlertsContext.Provider>
  );
};
export default function useAlerts() {
  return useContext(AlertsContext);
}
