import { collection, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const colRef = (user: any) => collection(db, "users", user, "groceries");
export const docRef = (user: any, title: any) =>
  doc(db, "users", user, "groceries", title);
