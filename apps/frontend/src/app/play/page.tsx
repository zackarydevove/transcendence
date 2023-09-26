import React from 'react';
import BackButton from '@/components/BackButton';
import MenuButton from '@components/MenuButton';

const Play: React.FC = () => {
  return (
    <div className='relative flex flex-col items-center justify-center h-screen w-screen bg-gray-900'>
        {/* Back Button */}
        <BackButton />
        {/* Menu Button */}
        <MenuButton/>

        <div className='flex flex-col items-center justify-center gap-3'>

            <h1 className='text-2xl text-white font-bold mb-8'>Choose Game Mode</h1>

            {/* Ranked Game Option */}
            <a href='/game' className='mb-4'>
                <div className='w-full p-6 bg-indigo-500 text-white text-center rounded-md cursor-pointer hover:bg-indigo-600 transition-colors duration-200'>
                    Solo Game
                </div>
            </a>

            {/* Friendly Game Option */}
            <a href='/game_multi'>
                <div className='w-full p-6 bg-teal-500 text-white text-center rounded-md cursor-pointer hover:bg-teal-600 transition-colors duration-200'>
                    Multiplayer Game
                </div>
            </a>

        </div>
    </div>
  );
}

export default Play;
