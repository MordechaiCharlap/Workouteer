import React, { createContext, useContext, useEffect } from "react";
const AlertsContext = createContext({});
export const AlertsProvider = ({ children }) => {
  return (
    <AlertsContext.Provider value={{ test: "test" }}>
      {children}
    </AlertsContext.Provider>
  );
};
export default function useAlerts() {
  return useContext(AlertsContext);
}
