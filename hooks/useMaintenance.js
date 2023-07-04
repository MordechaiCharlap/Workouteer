import { createContext, useContext, useEffect, useState } from "react";
import useAppData from "./useAppData";

const MaintenanceContext = createContext({});
export const MaintenanceProvider = ({ children }) => {
  const { specs } = useAppData();
  const [underMaintenance, setUnderMaintenance] = useState(false);
  useEffect(() => {
    if (!specs) return;
    if (specs.underMaintenance) setUnderMaintenance(true);
  }, [specs]);
  return (
    <MaintenanceContext.Provider value={{ underMaintenance }}>
      {children}
    </MaintenanceContext.Provider>
  );
};
export const useMaintenance = () => useContext(MaintenanceContext);
