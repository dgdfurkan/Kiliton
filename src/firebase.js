import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Kullanıcı kendi Firebase yapılandırmasını buraya girmelidir.
// Lütfen Firebase Console -> Project Settings -> General -> Your Apps kısmından
// yapılandırma kodunu alıp aşağıya yapıştırın.
const firebaseConfig = {
  apiKey: "API_KEY_BURAYA",
  authDomain: "PROJE_ID.firebaseapp.com",
  projectId: "PROJE_ID",
  storageBucket: "PROJE_ID.firebasestorage.app",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
