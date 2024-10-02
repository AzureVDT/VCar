import React, { useEffect } from "react";
import { JSX } from "react/jsx-runtime";
import { AuthContextType } from "../types/common";
import { getAccessToken, isTokenExpire, saveAccessToken, saveRefreshToken, saveUser } from "../utils";

const AuthContext = React.createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthProvider(
  props: JSX.IntrinsicAttributes &
    React.ProviderProps<AuthContextType>
) {
  const [isLogged, setIsLogged] = React.useState(false);
  const accessToken = getAccessToken();
  useEffect(() => {
    if (accessToken && !isTokenExpire(accessToken)) {
      setIsLogged(true);
    } else {
      saveAccessToken("");
      saveRefreshToken("");
      saveUser("");
      setIsLogged(false);
    }
  }, [accessToken])
  const contextValues = {
    isLogged,
    setIsLogged,
  };
  return <AuthContext.Provider
    {...props}
    value={contextValues}
  ></AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (typeof context === "undefined")
    throw new Error("useAuth must be used within AuthProvider");
  return context;
}
