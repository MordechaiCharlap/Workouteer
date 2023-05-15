import { createContext, useContext, useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

const ConnectionContext = createContext({});
export const ConnectionProvider = ({ children }) => {
  const [connected, setConnected] = useState(true);
  useEffect(() => {
    console.log("subscribing");
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnected(state.isConnected);
    });

    return () => {
      console.log("unsubscribing");
      unsubscribe();
    };
  }, []);

  return (
    <ConnectionContext.Provider value={{ connected }}>
      {children}
    </ConnectionContext.Provider>
  );
};
export const useConnection = () => useContext(ConnectionContext);
