'use client';

import { createContext, useContext, useEffect, useRef, useState } from "react";
import useNotificationContext from "@contexts/NotificationContext/useNotificationContext";
import createUserStore, { UserState, UserStore } from "./createUserStore";
import { AuthContext } from "@contexts/AuthContext/AuthContext";
import { useStore } from "zustand";
import socket from "@utils/socket";

export const UserContext = createContext({} as UserStore)

type UserProviderProps = React.PropsWithChildren<{
  initialState?: Partial<UserState>
}>

const UserProvider: React.FC<UserProviderProps> = ({ children, initialState }) => {

	const userStoreRef = useRef<UserStore>()
	const authStore = useContext(AuthContext)
  
	const isLogged = useStore(authStore, (state) => state.isLogged)
  
	const notificationContext = useNotificationContext()
  
	if (!userStoreRef.current) {
	  userStoreRef.current = createUserStore({
		notificationContext,
		initialState,
		authStore
	  })
	}
	
	const profile = useStore(userStoreRef.current, state => state.profile);
  
	useEffect(() => {
	  if (!isLogged) {
		userStoreRef.current?.getState().reset();
		return;
	  }
	  userStoreRef.current?.getState().loadProfile();
	}, [isLogged]);

	useEffect(() => {
		  if (profile && profile.id) {
			socket.emit('setOnline', { userId: profile.id });
		  }
	}, [profile])
  
	return (
	  <UserContext.Provider value={userStoreRef.current}>
		{children}
	  </UserContext.Provider>
	);
  };

export default UserProvider;
