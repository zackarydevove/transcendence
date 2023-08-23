'use client';

import useAuthContext from "@contexts/AuthContext/useAuthContext";
import useNotificationContext from "@contexts/NotificationContext/useNotificationContext";
import { useEffect } from "react";


const AuthButtons = () => {
  const startAuth = useAuthContext((state) => state.startAuth)

//   const notifcationCtx = useNotificationContext();

//   useEffect(() => {
// 		notifcationCtx.enqueueNotification({
// 		message: "hey",
// 		type: "default"
// 	})
//   }, []);

  const logout = useAuthContext((state) => state.logout)
  const isLogged = useAuthContext((state) => state.isLogged)

  return <div>
    {!isLogged && <button onClick={() => startAuth('login')}>
      Login
    </button>}
    {!isLogged && <button onClick={() => startAuth('register')}>
      Register
    </button>}
    {isLogged && <button onClick={() => logout()}> Logout </button>}
  </div>
}

export default AuthButtons;