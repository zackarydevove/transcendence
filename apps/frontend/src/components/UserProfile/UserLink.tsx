'use client';
import { FaComments, FaUser, FaUsers } from 'react-icons/fa';
import Link from "next/link"
import useUserContext from '@contexts/UserContext/useUserContext';
import formatUserName from '@utils/formatUserName';

const UserLink = () => {
  const profile = useUserContext((state) => state.profile)
  if (!profile) return null;

  return (
    <>
  <Link href={"/profile/" + formatUserName(profile.username)} className='flex flex-col items-center text-white hover:text-indigo-500'>
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
    </>
  )
}

export default UserLink