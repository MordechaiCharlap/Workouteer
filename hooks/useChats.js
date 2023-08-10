import { createContext, useContext, useEffect, useState } from "react";
import useAuth from "./useAuth";
import useAlerts from "./useAlerts";
import { getChat } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import useFirebase from "./useFirebase";
const ChatsContext = createContext({});
export const ChatsProvider = ({ children }) => {
  const { userLoaded, user } = useAuth();
  const { chatsAlerts } = useAlerts();
  const { db } = useFirebase();
  const [chats, setChats] = useState();

  const refreshChats = async () => {
    await getChatsArrayIncludeUsers(user);
  };
  useEffect(() => {
    if (!user) return;
    const getChatsArrayIncludeUsers = async () => {
      const chatsArr = [];
      for (var chatId of Object.keys(user.chats)) {
        var chat = await getChat(chatId);
        var chatToPush = {
          chat: {
            id: chatId,
            ...chat,
          },
        };
        if (!chat.isGroupChat) {
          for (var key of Object.keys(chat.members)) {
            if (key != user.id) {
              chatToPush = {
                ...chatToPush,
                user: (await getDoc(doc(db, "users", key))).data(),
              };
            }
          }
        }
        chatsArr.push(chatToPush);
      }
      chatsArr.sort(
        (a, b) => b.chat.lastMessage.sentAt - a.chat.lastMessage.sentAt
      );
      setChats(chatsArr);
    };
    getChatsArrayIncludeUsers();
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
