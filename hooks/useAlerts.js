import React, { createContext, useContext, useEffect, useState } from "react";
import useAuth from "./useAuth";
const AlertsContext = createContext({});
export const AlertsProvider = ({ children }) => {
  const { user, initialChatAlertsCount } = useAuth();
  const [chatAlertsCount, setChatAlertsCount] = useState(0);
  useEffect(() => {
    setChatAlertsCount(initialChatAlertsCount);
  }, [initialChatAlertsCount]);
  const calculateChatAlertsCount = async (userData) => {
    const chats = new Map(Object.entries(userData.chats));
    console.log("chats: ", chats);
    var count = 0;
    for (var chatId of chats.keys()) {
      const chat = await firebase.getChat(chatId);
      console.log(chat);
      const membersMap = new Map(Object.entries(chat.members));
      if (membersMap.get(userData.usernameLower).unreadAlert) {
        count++;
      }
    }
    console.log("unread chats: ", count);
    setChatAlertsCount(count);
  };
  return (
    <AlertsContext.Provider
      value={{ calculateChatAlertsCount, chatAlertsCount, setChatAlertsCount }}
    >
      {children}
    </AlertsContext.Provider>
  );
};
export default function useAlerts() {
  return useContext(AlertsContext);
}
