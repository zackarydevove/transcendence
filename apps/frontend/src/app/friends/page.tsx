import React from 'react';
import BackButton from '@/components/BackButton';
import ChooseList from '@components/Friends/ChooseList';
import FriendChat from '@components/Friends/FriendChat';
import FriendList from '@components/Friends/FriendList';
import SearchBar from '@components/Friends/SearchBar';

const Friends: React.FC = () => {
  return (
    <div className='relative flex items-center justify-center h-screen w-screen bg-gray-900'>
        {/* Back Button */}
        <BackButton />
        <div className='flex items-center justify-center gap-3 h-[700px] w-[1440px]'>
            {/* Left : Friend list / Users list */}
            <div className='flex flex-col gap-3 h-full'>
                <div className='h-full flex flex-col items-center justify-start bg-white rounded-xl shadow-md overflow-y-auto'>
                  {/* Choose Friend List or Users List */}
                  <ChooseList />
                  <div className='flex flex-col items-center justify-start overflow-y-auto w-full px-7 pb-7 '>
                    {/* SearchBar */}
                    <SearchBar/>
                    {/* Friends List */}
                    <FriendList/>
                  </div>
                </div>
            </div>
            {/* Right : Chat */}
            <FriendChat/>
        </div>
    </div>
  )
}

export default Friends;