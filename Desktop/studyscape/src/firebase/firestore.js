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
  onSnapshot,
} from "firebase/firestore";
import { app } from "./config";

export const db = getFirestore(app);

export const isUsernameTaken = async (username) => {
  const q = query(
    collection(db, "usernames"),
    where("username", "==", username.toLowerCase())
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

export const createUserProfile = async (uid, username, email) => {
  await setDoc(doc(db, "users", uid), {
    username: username.toLowerCase(),
    email,
    xp: 0,
    totalStudyTime: 0,
    streak: 0,
    sessions: 0,
    xpToday: 0,
    lastStudyDate: null,
    buildingLevel: 1,
    createdAt: new Date(),
  });
  await setDoc(doc(db, "usernames", username.toLowerCase()), {
    username: username.toLowerCase(),
    uid,
  });
};

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};

export const addXP = async (uid, secondsStudied, xpEarned) => {
  const today = new Date().toDateString();
  const profile = await getUserProfile(uid);
  const lastDate = profile?.lastStudyDate;
  const isNewDay = lastDate !== today;

  await updateDoc(doc(db, "users", uid), {
    xp: increment(xpEarned),
    totalStudyTime: increment(secondsStudied),
    sessions: increment(1),
    xpToday: isNewDay ? xpEarned : increment(xpEarned),
    lastStudyDate: today,
    streak: isNewDay ? increment(1) : profile?.streak || 1,
  });
};

export const subscribeToProfile = (uid, callback) => {
  return onSnapshot(doc(db, "users", uid), (snap) => {
    if (snap.exists()) callback(snap.data());
  });
};
