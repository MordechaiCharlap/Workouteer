import { firestoreImport } from "../services/firebase";
import { collection, query, where, getDocs, getDoc } from "firebase/firestore";
async function useCheckEmail(email) {
  const firestore = firestoreImport;
  const usersRef = collection(firestore, "users");
  const q = query(usersRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.size > 0) {
    return false;
  }
  return true;
}

export default useCheckEmail;
