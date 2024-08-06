const dotenv = require('dotenv');
dotenv.config();

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const APIKEY = process.env.REACT_APP_FIREBASE_API_KEY;
const AUTHDOMAIN = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN;
const PROJECTID = process.env.REACT_APP_FIREBASE_PROJECT_ID;
const STORAGEBUCKET = process.env.REACT_APP_FIREBASE_STORAGE_BUCKET;
const MESSAGINGSENDERID = process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID;
const APPID = process.env.REACT_APP_FIREBASE_APP_ID;
const MEASUREMENTID = process.env.REACT_APP_FIREBASE_MEASUREMENT_ID;

const firebaseConfig = {
  apiKey: APIKEY,
  authDomain: AUTHDOMAIN,
  projectId: "inventory-management-97279",
  storageBucket: STORAGEBUCKET,
  messagingSenderId: MESSAGINGSENDERID,
  appId: APPID,
  measurementId: MEASUREMENTID
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };