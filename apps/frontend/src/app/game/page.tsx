'use client'
 
import { useEffect } from 'react'
import React from 'react';
import Babylon_pong from '../../components/Game/SceneComponent';
import BackButton from '@/components/BackButton';
import MenuButton from '@components/MenuButton';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from "zustand";
import { AuthContext } from '@contexts/AuthContext/AuthContext';

const Game_page = () => {
  const router = useRouter();
  const authStore = useContext(AuthContext)
  const isLogged = useStore(authStore, (state) => state.isLogged)
  useEffect(() => {
    if (!isLogged) {
      router.push('/login');
      return
    }
  }, [isLogged])
  return (
    <div>
      <title>Pong 3D</title>
      <BackButton />
      {/* Menu Button */}
      <MenuButton/>
      <Babylon_pong />
    </div>
  );
};

export default Game_page;