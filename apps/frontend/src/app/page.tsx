import React from 'react'
import Link from 'next/link';
import { FaGamepad, FaUser, FaUsers, FaComments, FaPowerOff, FaTrophy } from 'react-icons/fa';
import Container from "@mui/material/Container"
import UserProfile from "@components/UserProfile/UserProfile";
import AuthButtons from "@components/AuthButtons/AuthButtons";

export default async function Home() {

  return (
    <Container className='flex gap-4 items-center justify-center flex-col h-screen w-screen bg-gray-900'>

      <div className='flex items-center justify-center gap-6 text-white text-lg'>
        {/* Play */}
        <Link href="/play" className='flex flex-col items-center text-white hover:text-indigo-500'>
          <FaGamepad className='h-12 w-12' />
          <p>Play</p>
        </Link>

        {/* Profile */}
        <Link href="/profile" className='flex flex-col items-center text-white hover:text-indigo-500'>
          <FaUser className='h-12 w-12' />
          <p>Profile</p>
        </Link>

        {/* Friends */}
        <Link href="/friends" className='flex flex-col items-center text-white hover:text-indigo-500'>
          <FaUsers className='h-12 w-12' />
          <p>Friends</p>
        </Link>

        {/* Chat */}
        <Link href="/chat" className='flex flex-col items-center text-white hover:text-indigo-500'>
          <FaComments className='h-12 w-12' />
          <p>Chat</p>
        </Link>

        {/* Leaderboard */}
        <Link href="/leaderboard" className='flex flex-col items-center text-white hover:text-indigo-500'>
          <FaTrophy className='h-12 w-12' />
          <p>Leaderboard</p>
        </Link>

        {/* Logout */}
        <Link href="/login" className='flex flex-col items-center text-white hover:text-indigo-500'>
          <FaPowerOff className='h-12 w-12' />
          <p>Logout</p>
        </Link>

      </div>

      <UserProfile />
      <AuthButtons />

    </Container>
  )
}

