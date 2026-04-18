import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, signInAnonymously, signOut } from "firebase/auth";
import app from "../firebase";

const AuthContext = createContext();

const ADMIN_PASSWORD = "ethnicaa@2025";

export const AuthProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(
    localStorage.getItem("ethnicaa_admin") === "true"
  );
  const [loading, setLoading] = useState(false);

  const auth = getAuth(app);

  // Auto-re-authenticate with Firebase if admin flag is set
  useEffect(() => {
    if (isAdmin && !auth.currentUser) {
      signInAnonymously(auth).catch(err => {
        console.error("Auto-auth failed:", err);
        setIsAdmin(false);
      });
    }
  }, [isAdmin, auth]);

  const login = async (password) => {
    if (password !== ADMIN_PASSWORD) {
      return { success: false, message: "Invalid password" };
    }

    try {
      setLoading(true);
      await signInAnonymously(auth);
      localStorage.setItem("ethnicaa_admin", "true");
      setIsAdmin(true);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Firebase auth failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("ethnicaa_admin");
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAdmin, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
