'use client'

import { useState , useEffect} from 'react'
import React from 'react';
import { useRouter } from 'next/navigation';
import BackButton from '@components/BackButton';
import Babylon_pong_invit from '@components/Game/SceneComponentinvit';
import { useContext } from 'react';
import { UserContext } from '@contexts/UserContext/UserContext';
import { useStore } from "zustand";
import { AuthContext } from '@contexts/AuthContext/AuthContext';

const GameMultiPage = ({ params }: { params: { username: string } }) => {
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
      <Babylon_pong_invit user= {params.username}/>
    </div>
  );
}

export default GameMultiPage;
