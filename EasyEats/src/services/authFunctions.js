// src/services/authFunctions.js
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase configuration/firebaseConfig";  // Import Firebase Auth

// 🔹 Sign Up Function
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up:", userCredential.user);
  } catch (error) {
    console.error("Signup Error:", error.message);
  }
};

// 🔹 Sign In Function
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User signed in:", userCredential.user);
  } catch (error) {
    console.error("Signin Error:", error.message);
  }
};

// 🔹 Sign Out Function
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out");
  } catch (error) {
    console.error("Signout Error:", error.message);
  }
};

// 🔹 Check Authentication State
export const checkAuthState = (setUser) => {
  onAuthStateChanged(auth, (user) => {
    setUser(user);
  });
};
