import React from 'react';
import BackButton from '@/components/BackButton';
import Historic from '@components/Profile/Historic';
import ProfileData from '@components/Profile/ProfileData';
import TWOFAAuth from '@components/Profile/TWOFAAuth';

interface UserProfileProps {
	params: {username: string}
}

const UserProfile: React.FC<UserProfileProps> = ({ params }) => {

  return (
    <div className='relative flex items-center justify-center h-screen w-screen bg-gray-900 overflow-y-auto'>
        {/* Back Button */}
        <BackButton />
        <div className='flex gap-3 lg:w-[960px] max-lg:flex-col'>
            {/* Left */}
            <div className='flex flex-col gap-3'>
                {/* up : User data */}
                <ProfileData username={params.username}/>
                {/* down : 2FA Authenticator button*/}
                <TWOFAAuth />
            </div>
            {/* Right : Game Historic*/}
            <Historic username={params.username}/>
        </div>
    </div>
  )
};

export default UserProfile;