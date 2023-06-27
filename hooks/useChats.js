import { createContext, useContext, useEffect, useState } from "react";
import useAuth from "./useAuth";
import { getChatsArrayIncludeUsers } from "../services/firebase";
import useAlerts from "./useAlerts";
const ChatsContext = createContext({});
export const ChatsProvider = ({ children }) => {
  const { userLoaded, user } = useAuth();
  const { chatsAlerts } = useAlerts();
  const [chats, setChats] = useState();
  const refreshChats = async () => {
    var arr = await getChatsArrayIncludeUsers(user);
    setChats(arr);
  };
  useEffect(() => {
    if (!userLoaded || !user) return;
    const getChats = async () => {
      var arr = await getChatsArrayIncludeUsers(user);
      setChats(arr);
    };
    getChats();
  }, [userLoaded, chatsAlerts, user?.chats]);
  return (
    <ChatsContext.Provider value={{ chats, setChats, refreshChats }}>
      {children}
    </ChatsContext.Provider>
  );
};
export default function useChats() {
  return useContext(ChatsContext);
}
