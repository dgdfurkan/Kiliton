import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Kullanıcı kendi Firebase yapılandırmasını buraya girmelidir.
// Lütfen Firebase Console -> Project Settings -> General -> Your Apps kısmından
// yapılandırma kodunu alıp aşağıya yapıştırın.
const firebaseConfig = {
  apiKey: "AIzaSyAHhxpM8OWxYf0_HU4sgiBDw7JP15OQsm4",
  authDomain: "kiliton.firebaseapp.com",
  projectId: "kiliton",
  storageBucket: "kiliton.firebasestorage.app",
  messagingSenderId: "46796374839",
  appId: "1:46796374839:web:d64ebb717649be671890b2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
