import { firestoreImport } from "../firebase-config";
import { collection, query, where, getDocs, getDoc } from "firebase/firestore";
async function useCheckEmail(email) {
  const firestore = firestoreImport;
  const q = query(collection(firestore, "users"), where("email", "==", email));
  const snapshot = await getDocs(q);
  if (snapshot.size > 0) return false;
}

export default useCheckEmail;
