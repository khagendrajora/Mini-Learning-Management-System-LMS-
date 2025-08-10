import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { toast, ToastContainer } from "react-toastify";
const URL = import.meta.env.VITE_Backend_URL;

type AuthContextType = {
  currentUser: User | null;
  register: (email: string, password: string, name: string) => Promise<any>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  getIdToken: (forceRefresh?: boolean) => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const register = async (email: string, password: string, name: string) => {
    try {
      const userData = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const firebaseId = userData.user.uid;
      const token = await userData.user.getIdToken();

      const res = await fetch(`${URL}/add-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          name,
          firebaseId,
          email,
          password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error("Error Occured");
      }

      return data;
    } catch (err) {
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    const userData = await signInWithEmailAndPassword(auth, email, password);
    const token = await userData.user.getIdToken();
    const res = await fetch(`${URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error("Login failed");
    }
    sessionStorage.setItem("user", JSON.stringify(data));
    return data;
  };

  const loginWithGoogle = async () => {
    const userData = await signInWithPopup(auth, googleProvider);
    const token = await userData.user.getIdToken();

    const res = await fetch(`${URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ email: userData.user.email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    return data;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const getIdToken = async (forceRefresh = false) => {
    const user = auth.currentUser;
    if (!user) return null;
    return user.getIdToken(forceRefresh);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user ?? null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        register,
        login,
        loginWithGoogle,
        logout,
        getIdToken,
      }}
    >
      <ToastContainer />
      {!loading && children}
    </AuthContext.Provider>
  );
};
