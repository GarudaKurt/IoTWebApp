import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'; // Import firebase/firestore
import { getDatabase } from 'firebase/database'; // Import getDatabase from firebase/database

// Combined Firebase configuration for Firestore and Realtime Database
const firebaseConfig = {
  apiKey: "AIzaSyDvuCVMH8aXMMpSdhIKSyyHFbcYPS0VUIo", //realtime or firestore database will work 
  authDomain: "smartlabdb.firebaseapp.com", //firestore database
  databaseURL: "https://connection-9ad5a-default-rtdb.asia-southeast1.firebasedatabase.app", // Realtime Database URL
  projectId: "smartlabdb", //firestore
  storageBucket: "smartlabdb.appspot.com", //firestore
  messagingSenderId: "617515830869", //firestore
  appId: "1:617515830869:web:97712d76adccf6bd338edc", //firestore
  measurementId: "G-L4XB80PR64" //realtime
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(firebaseApp);

// Initialize Realtime Database
export const firebaseDatabase = getDatabase(firebaseApp);
