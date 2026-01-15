import { createContext, useEffect, useState } from "react";
import { meApi, refreshApi, logoutApi } from "../services/authApi";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("tb_accessToken") || ""
  );
  const [loading, setLoading] = useState(true);

  const setSession = (token, userData) => {
    setAccessToken(token);
    localStorage.setItem("tb_accessToken", token);
    setUser(userData);
  };

  const clearSession = async () => {
    try {
      await logoutApi();
    } catch (e) {
    }
    setUser(null);
    setAccessToken("");
    localStorage.removeItem("tb_accessToken");
  };

  const loadUser = async () => {
    try {
      if (!accessToken) {
        const refreshRes = await refreshApi();
        const newToken = refreshRes.data.accessToken;
        localStorage.setItem("tb_accessToken", newToken);
        setAccessToken(newToken);

        const meRes = await meApi(newToken);
        setUser(meRes.data.user);
      } else {
        const meRes = await meApi(accessToken);
        setUser(meRes.data.user);
      }
    } catch (err) {
      setUser(null);
      setAccessToken("");
      localStorage.removeItem("tb_accessToken");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        setSession,
        clearSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
