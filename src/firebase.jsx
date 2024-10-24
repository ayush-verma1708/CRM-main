// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMWPYMCchKuqmIZgS4VuFsFeaYBYjfG_Y",
  authDomain: "crm-web-application-a9758.firebaseapp.com",
  projectId: "crm-web-application-a9758",
  storageBucket: "crm-web-application-a9758.appspot.com",
  messagingSenderId: "836247706495",
  appId: "1:836247706495:web:3ba6f0df928be413a5d84a",
  measurementId: "G-8BYENZPDTG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);

export {auth, db}