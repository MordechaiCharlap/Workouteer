import { createContext, useContext, useEffect, useState } from "react";
import useAppData from "./useAppData";

const MaintenanceContext = createContext({});
export const MaintenanceProvider = ({ children }) => {
  const { appData } = useAppData();
  const [underMaintenance, setUnderMaintenance] = useState(false);
  useEffect(() => {
    if (!appData) return;
    if (appData.underMaintenance) setUnderMaintenance(true);
  }, [appData]);
  return (
    <MaintenanceContext.Provider value={{ underMaintenance }}>
      {children}
    </MaintenanceContext.Provider>
  );
};
export const useMaintenance = () => useContext(MaintenanceContext);
