// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "@firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAEPe__RN2M__xNstUC1PDR8_V3FUdzsHc",
  authDomain: "jojo-nextjs-ai.firebaseapp.com",
  databaseURL: "https://jojo-nextjs-ai-default-rtdb.firebaseio.com",
  projectId: "jojo-nextjs-ai",
  storageBucket: "jojo-nextjs-ai.appspot.com",
  messagingSenderId: "580697794238",
  appId: "1:580697794238:web:b6650bd14ec88296e860ef",
  measurementId: "G-N3GR08N9H6",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
