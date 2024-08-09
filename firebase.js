// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Corrected here

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDtdmaywUt90b8ifIOQx1DReXQ29oSgnIk",
  authDomain: "inventory-management-8bb08.firebaseapp.com",
  projectId: "inventory-management-8bb08",
  storageBucket: "inventory-management-8bb08.appspot.com",
  messagingSenderId: "819843205183",
  appId: "1:819843205183:web:c3bddf98b9a55908a8d08a",
  measurementId: "G-KL4G5XWYS9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app); // Corrected here

export { firestore };
