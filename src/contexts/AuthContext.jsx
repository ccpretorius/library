// src/contexts/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const AuthContext = createContext();

const initialState = {
  user: null,
  loading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload, loading: false };
    case "LOGOUT":
      return { ...state, user: null, loading: false };
    case "AUTH_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_LOADING":
      return { ...state, loading: true };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({ type: "LOGIN", payload: user });
      } else {
        dispatch({ type: "LOGOUT" });
      }
    });
    return unsubscribe;
  }, []);

  const login = (email, password) => {
    dispatch({ type: "SET_LOADING" });
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        dispatch({ type: "LOGIN", payload: userCredential.user });
      })
      .catch((error) => {
        dispatch({ type: "AUTH_ERROR", payload: error.message });
      });
  };

  const signup = (email, password, displayName) => {
    dispatch({ type: "SET_LOADING" });
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        return updateProfile(user, { displayName })
          .then(() => {
            return setDoc(doc(db, "users", user.uid), {
              uid: user.uid,
              displayName,
              email: user.email,
            });
          })
          .then(() => {
            dispatch({ type: "LOGIN", payload: { ...user, displayName } });
          })
          .catch((error) => {
            dispatch({ type: "AUTH_ERROR", payload: error.message });
          });
      })
      .catch((error) => {
        dispatch({ type: "AUTH_ERROR", payload: error.message });
      });
  };

  const logout = () => {
    return signOut(auth)
      .then(() => {
        dispatch({ type: "LOGOUT" });
      })
      .catch((error) => {
        dispatch({ type: "AUTH_ERROR", payload: error.message });
      });
  };

  const resetPassword = (email) => {
    dispatch({ type: "SET_LOADING" });
    return sendPasswordResetEmail(auth, email).catch((error) => {
      dispatch({ type: "AUTH_ERROR", payload: error.message });
    });
  };

  return <AuthContext.Provider value={{ state, login, signup, logout, resetPassword }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
