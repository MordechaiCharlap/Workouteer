import { createContext, useContext, useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

const ConnectionContext = createContext({});
export const ConnectionProvider = ({ children }) => {
  const [connected, setConnected] = useState(true);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnected(state.isConnected);
    });

    return () => {
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

const initialState = {
  connected: true,
};
