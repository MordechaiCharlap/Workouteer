import { createContext, useContext, useEffect, useState } from "react";
import AwesomeModal from "../components/AwesomeModal";
import useAppData from "./useAppData";

const MaintenanceContext = createContext({});
export const MaintenanceProvider = ({ children }) => {
  console.log("test");
  const { appData } = useAppData();
  const [underMaintenance, setUnderMaintenance] = useState(false);
  useEffect(() => {
    console.log("testing");
  }, []);
  useEffect(() => {
    console.log("test");
    if (!appData) return;
    console.log(appData);
    if (appData.underMaintenance == true) setUnderMaintenance(true);
  }, [appData]);
  return (
    <MaintenanceContext.Provider value={{ underMaintenance }}>
      {children}
      <AwesomeModal />
    </MaintenanceContext.Provider>
  );
};
export default function useMaintenance() {
  useContext(MaintenanceContext);
}
