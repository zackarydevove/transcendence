'use client';

import { createContext, useRef } from "react";
import type { AuthState, AuthStore } from "./createAuthStore";
import createAuthStore from "./createAuthStore";
import AuthModal from "@components/AuthModal/AuthModal";
import useNotificationContext from "@contexts/NotificationContext/useNotificationContext";

export const AuthContext = createContext({} as AuthStore)

type AuthProviderProps = React.PropsWithChildren<{
  initialState?: Partial<AuthState>
}>

const AuthProvider: React.FC<AuthProviderProps> = ({ children, initialState }) => {

  const authStoreRef = useRef<AuthStore>()
  const notificationContext = useNotificationContext()

  if (!authStoreRef.current) {
    authStoreRef.current = createAuthStore({
      notificationContext,
      initialState
    })
  }

  return <AuthContext.Provider value={authStoreRef.current}>
    {children}
    <AuthModal />
  </AuthContext.Provider>
}

export default AuthProvider