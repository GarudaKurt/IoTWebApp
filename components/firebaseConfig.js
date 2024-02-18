import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6PTPz4K4T7XtJ0BPFrO7dkf_dUmyRP_o",
  authDomain: "smartlabdb.firebaseapp.com",
  projectId: "smartlabdb",
  storageBucket: "smartlabdb.appspot.com",
  messagingSenderId: "617515830869",
  appId: "1:617515830869:web:97712d76adccf6bd338edc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//initialized firestore
export const db = getFirestore(app )