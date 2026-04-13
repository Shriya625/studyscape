import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  increment,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "./config";

export const db = getFirestore(app);

// Check if username is already taken
export const isUsernameTaken = async (username) => {
  const q = query(
    collection(db, "usernames"),
    where("username", "==", username.toLowerCase())
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

// Save new user to Firestore
export const createUserProfile = async (uid, username, email) => {
  await setDoc(doc(db, "users", uid), {
    username: username.toLowerCase(),
    email,
    xp: 0,
    totalStudyTime: 0,
    streak: 0,
    buildingLevel: 1,
    createdAt: new Date(),
  });
  await setDoc(doc(db, "usernames", username.toLowerCase()), {
    username: username.toLowerCase(),
    uid,
  });
};

// Get user profile
export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};

// Add XP after a study session
export const addXP = async (uid, secondsStudied, xpEarned) => {
  await updateDoc(doc(db, "users", uid), {
    xp: increment(xpEarned),
    totalStudyTime: increment(secondsStudied),
  });
};
