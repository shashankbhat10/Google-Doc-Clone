const { getApp, getApps, initializeApp } = require("firebase-admin/app");
const serviceAccount = require("../doc-clone-2750f-firebase-adminsdk-ytmhr-0a11087e16.json");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore } = require("firebase-admin/firestore");
const { credential } = require("firebase-admin");

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

// const firebaseConfig = {
//   apiKey: "AIzaSyB1p2f_3juNUEVTfr9Xg_d9tWyi-gnu_YY",
//   authDomain: "doc-clone-2750f.firebaseapp.com",
//   projectId: "doc-clone-2750f",
//   storageBucket: "doc-clone-2750f.appspot.com",
//   messagingSenderId: "465639039510",
//   appId: "1:465639039510:web:969d2d0447b76f1cc48b37",
// };
// Initialize Firebase
// const app = initializeApp(firebaseConfig);

const app = initializeApp({ credential: credential.cert(serviceAccount) });
// const app = initializeApp({ credential: credential.cert({}) });
const auth = getAuth(app);
const firestore = getFirestore(app);

module.exports = { auth, firestore };
