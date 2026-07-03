import { useContext } from "react";
import  AuthContext  from "../context/AuthContext";

export const useAuth = () => {
// 3. Create the Custom Hook for consuming context
  const context = useContext(AuthContext);

  // Guard clause to prevent usage outside provider scope
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
