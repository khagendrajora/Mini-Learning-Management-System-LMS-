import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA0j745Ra_QXBMsFXJH5LzLiMgshHM3hGA",
  authDomain: "mini-lms-491eb.firebaseapp.com",
  projectId: "mini-lms-491eb",
  storageBucket: "mini-lms-491eb.firebasestorage.app",
  messagingSenderId: "614364186620",
  appId: "1:614364186620:web:a72819fcb29940894e1479",
  measurementId: "G-9203WV91RP",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
