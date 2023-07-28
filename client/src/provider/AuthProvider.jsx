import { createContext, useEffect, useState } from "react";
import { auth } from "../firebase-client";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged(setUser);
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
};
