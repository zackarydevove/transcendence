"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';

const BackButton: React.FC = () => {
  const router = useRouter();

  return (
    <div>
        <button 
          className='flex justify-center items-center absolute top-4 left-4 bg-indigo-500 text-white rounded-full p-2 hover:bg-white hover:text-indigo-500 transition'
          onClick={() => router.back()}
        >
          <FaArrowLeft size={'1.4em'}/>
        </button>
    </div>
  )
}

export default BackButton
