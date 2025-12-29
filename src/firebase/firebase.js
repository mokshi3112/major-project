// src/firebase/firebase.js
// Use compat so existing v8-style code (db.collection(...)) keeps working
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
// analytics optional - remove if you don't need it in browser dev env
import "firebase/compat/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAMIw9G0Y5R29p0t9JJv_BAtKLGWyUj-vo",
  authDomain: "academic-verify-51961.firebaseapp.com",
  projectId: "academic-verify-51961",
  storageBucket: "academic-verify-51961.firebasestorage.app",
  messagingSenderId: "489811136233",
  appId: "1:489811136233:web:ae47a0c7c4e1d9c2db2a78",
  measurementId: "G-6SVM4LFTB1",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  try {
    // analytics might throw in some environments; guard it
    if (typeof window !== "undefined" && "measurementId" in firebaseConfig) {
      firebase.analytics?.();
    }
  } catch (e) {
    // ignore analytics init errors in dev
    // console.warn("Firebase analytics not initialized", e);
  }
}

const db = firebase.firestore();
const auth = firebase.auth();

export { firebase, db, auth };
export default firebase;
