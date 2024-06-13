// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAWK5vcqg1RzipYZEQPq5UtP9nldyP0Kis",
  authDomain: "library-2dbf1.firebaseapp.com",
  projectId: "library-2dbf1",
  storageBucket: "library-2dbf1.appspot.com",
  messagingSenderId: "188925128526",
  appId: "1:188925128526:web:ab0d8152e1aacc9389b81f",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
