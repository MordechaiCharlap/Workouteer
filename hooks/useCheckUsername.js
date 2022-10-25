import { firestoreImport } from "../services/firebase";
import { collection, query, where, getDocs, getDoc } from "firebase/firestore";
async function useCheckUsername(username) {
  const firestore = firestoreImport;
  const usersRef = collection(firestore, "users");
  const q = query(
    usersRef,
    where("usernameLower", "==", username.toLowerCase())
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.size > 0) {
    console.log("bigger than 0", querySnapshot.size);
    return false;
  }
  return true;
}

export default useCheckUsername;
