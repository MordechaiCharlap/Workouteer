import { firestoreImport } from "../firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";
async function useUserData(email) {
  var userData;
  const firestore = firestoreImport;
  const q = query(collection(firestore, "users"), where("email", "==", email));
  await getDocs(q).then((snapshot) => {
    snapshot.forEach((doc) => {
      userData = doc.data();
    });
  });
  return userData;
}

export default useUserData;
