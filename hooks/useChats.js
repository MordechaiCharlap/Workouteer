import { createContext, useContext, useEffect, useRef, useState } from "react";
import useAuth from "./useAuth";
import useAlerts from "./useAlerts";
import { getChat, getUserDataById } from "../services/firebase";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import useFirebase from "./useFirebase";
const ChatsContext = createContext({});
export const ChatsProvider = ({ children }) => {
  const { userLoaded, user } = useAuth();
  const { chatsAlerts } = useAlerts();
  const { db } = useFirebase();
  const [chatsAndUsers, setChatsAndUsers] = useState([]);
  const refreshChats = async () => {
    await getChatsArrayIncludeUsers(user);
  };
  useEffect(() => {
    if (!user) return;
    const chatAndUsersClone = [...chatsAndUsers];
    const chatsQuery = query(
      collection(db, "chats"),
      where(`members.${user.id}`, "!=", null)
    );

    const listener = onSnapshot(chatsQuery, (snap) => {
      snap.docChanges().forEach((change) => {
        const chatData = change.doc.data();
        if (change.type == "added") {
          if (
            chatAndUsersClone.findIndex(
              (chatAndUser) => chatAndUser.chat.id == change.doc.id
            ) == -1
          ) {
            if (!chatData.isGroupChat) {
              var otherUserId;
              for (var userId of Object.keys(chatData.members)) {
                if (userId != user.id) {
                  otherUserId = userId;
                  break;
                }
              }
              getUserDataById(otherUserId).then((userData) => {
                chatAndUsersClone.push({
                  user: userData,
                  chat: { id: change.doc.id, ...chatData },
                });
                chatAndUsersClone.sort(
                  (a, b) =>
                    b.chat.lastMessage.sentAt - a.chat.lastMessage.sentAt
                );
              });
            }
          }
        } else if (change.type === "modified") {
          console.log("modified");

          const modifiedChat = {
            id: change.doc.id,
            ...chatData,
          };
          const oldChatIndex = chatAndUsersClone.findIndex(
            (chatAndUser) => chatAndUser.chat.id == modifiedChat.id
          );
          const newChatAndUser = {
            chat: modifiedChat,
            user: chatAndUsersClone[oldChatIndex].user,
          };
          chatAndUsersClone[oldChatIndex] = newChatAndUser;
        } else if (change.type === "removed") {
          chatAndUsersClone.splice(
            chatAndUsersClone.findIndex(
              (chatAndUser) => chatAndUser.chat.id == change.doc.id
            ),
            1
          );
        }
      });
      setChatsAndUsers(chatAndUsersClone);
    });
    return () => listener();
  }, [userLoaded]);
  // useEffect(() => {
  //   if (!user) return;

  //   const getChatsArrayIncludeUsers = async () => {
  //     const chatsArr = [];
  //     for (var chatId of Object.keys(user.chats)) {
  //       var chat = await getChat(chatId);
  //       var chatToPush = {
  //         chat: {
  //           id: chatId,
  //           ...chat,
  //         },
  //       };
  //       if (!chat.isGroupChat) {
  //         for (var key of Object.keys(chat.members)) {
  //           if (key != user.id) {
  //             chatToPush = {
  //               ...chatToPush,
  //               user: (await getDoc(doc(db, "users", key))).data(),
  //             };
  //           }
  //         }
  //       }
  //       chatsArr.push(chatToPush);
  //     }
  //     chatsArr.sort(
  //       (a, b) => b.chat.lastMessage.sentAt - a.chat.lastMessage.sentAt
  //     );
  //     setChatsAndUsers(chatsArr);
  //   };
  //   getChatsArrayIncludeUsers();
  // }, [userLoaded, chatsAlerts, user?.chats]);
  return (
    <ChatsContext.Provider
      value={{ chatsAndUsers, setChatsAndUsers, refreshChats }}
    >
      {children}
    </ChatsContext.Provider>
  );
};
export default function useChats() {
  return useContext(ChatsContext);
}
