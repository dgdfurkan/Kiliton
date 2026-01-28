import React, { useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function signup(email, password, name) {
    return createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
        // Profil ismini güncelle
        if (name) {
            updateProfile(userCredential.user, {
                displayName: name
            });
        }
        return userCredential;
    });
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, fetch additional details from Firestore
        const db = getFirestore();
        const userDocRef = doc(db, "users", user.uid);

        // Real-time listener for user data (role changes, group changes)
        const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            setCurrentUser({ ...user, ...docSnapshot.data() });
          } else {
            setCurrentUser(user);
          }
          setLoading(false);
        }, (error) => {
          console.error("Error fetching user data:", error);
          setCurrentUser(user);
          setLoading(false);
        });

        return () => {
          unsubscribeSnapshot();
        };
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
