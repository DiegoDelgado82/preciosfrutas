// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBUAGpuKitC-ph6gKHUgiid8D_AYJrEI5w",
  authDomain: "precios-16ac1.firebaseapp.com",
  projectId: "precios-16ac1",
  storageBucket: "precios-16ac1.firebasestorage.app",
  messagingSenderId: "171846962757",
  appId: "1:171846962757:web:874ec71eeb1576496d5d2c",
  measurementId: "G-DVJZ09ZW2P"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // <-- ESTE es el que tenés que exportar

export { db };