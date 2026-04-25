import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, signInAnonymously, signOut } from "firebase/auth";
import app from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const auth = getAuth(app);

  // Use Firebase Auth state as the source of truth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && localStorage.getItem("ethnicaa_admin_active") === "true") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [auth]);

  const login = async (password) => {
    const SECURE_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

    if (!SECURE_PASSWORD) {
      console.error("CRITICAL: VITE_ADMIN_PASSWORD is not set in environment.");
      return { success: false, message: "Server configuration error" };
    }

    if (password !== SECURE_PASSWORD) {
      return { success: false, message: "Invalid password" };
    }

    try {
      setLoading(true);
      // Log in anonymously to get a valid Firebase session for security rules
      await signInAnonymously(auth);
      localStorage.setItem("ethnicaa_admin_active", "true");
      setIsAdmin(true);
      return { success: true };
    } catch (err) {
      console.error("Auth Error:", err);
      return { success: false, message: "Secure authentication failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("ethnicaa_admin_active");
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAdmin, login, logout, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
