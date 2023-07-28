// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCeQ_hTEI40YsRo1igx4YOnTDkcHLbk67s",
//   authDomain: "collab-text-editor.firebaseapp.com",
//   projectId: "collab-text-editor",
//   storageBucket: "collab-text-editor.appspot.com",
//   messagingSenderId: "94796268134",
//   appId: "1:94796268134:web:69d2e79103d85579a6e3a7",
//   measurementId: "G-75VTSTQHSZ",
// };

const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
  appId: process.env.FIREBASE_APPID,
};
// Initialize Firebase
// const app = initializeApp(firebaseConfig);

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const firestore = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { firestore, auth, googleProvider };
