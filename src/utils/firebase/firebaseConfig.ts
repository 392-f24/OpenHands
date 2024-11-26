// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCfG-2C0048aiN_4r_i4kuhl30Emn4V2h4',
  authDomain: 'openhands-48a60.firebaseapp.com',
  projectId: 'openhands-48a60',
  storageBucket: 'openhands-48a60.firebasestorage.app',
  messagingSenderId: '772096397388',
  appId: '1:772096397388:web:5550007864b0df426ea4e9',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = initializeFirestore(app, {});

const auth = getAuth(app);

export { auth, db };
