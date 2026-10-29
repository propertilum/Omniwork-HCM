import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithCustomToken
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  onSnapshot 
} from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyAyRKeaHwADbz9m7reh5bVoCG1veCBUc88",
  authDomain: "hcm--lite.firebaseapp.com",
  projectId: "hcm--lite",
  storageBucket: "hcm--lite.firebasestorage.app",
  messagingSenderId: "638442625540",
  appId: "1:638442625540:web:865e64045554e161bc7351",
  measurementId: "G-WH1ZLD7NV2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Application namespace
export const appId = (typeof window !== 'undefined' && window.__app_id) ? window.__app_id : 'omniwork-enterprise-hcm';

// Helper for Firestore paths (Scoped public artifacts collections)
export const getPublicCol = (colName) => collection(db, 'artifacts', appId, 'public', 'data', colName);
export const getPublicDoc = (colName, docId) => doc(db, 'artifacts', appId, 'public', 'data', colName, docId);

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithCustomToken,
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  onSnapshot
};
