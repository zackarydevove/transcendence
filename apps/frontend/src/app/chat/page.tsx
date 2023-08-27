"use client"
import React, { useState, useEffect } from 'react';
import BackButton from '@/components/BackButton';
import Settings from '@/components/Chat/Settings';
import CreateChat from '@/components/Chat/CreateChat';
import Discussion from '@/components/Chat/Discussion';
import CreateChannelButton from '@/components/Chat/CreateChannelButton';
import JoinableChannels from '@/components/Chat/JoinableChannels';
import ToggleChannel from '@/components/Chat/ToggleChannel';
import UserChannels from '@/components/Chat/UserChannels';
import InviteUsers from '@/components/Chat/InviteUsers';
import LeaveChannel from '@/components/Chat/LeaveChannel';
import EraseChannel from '@/components/Chat/EraseChannel';
import KickModal from '@/components/Chat/KicKModal';
import MuteModal from '@/components/Chat/MuteModal';
import BanModal from '@/components/Chat/BanModal';
import JoinModal from '@components/Chat/JoinModal';
import AdminModal from '@components/Chat/AdminModal';
import { useStore } from '@/state/store';

const Chat: React.FC = () => {

    const { 
        createOpen,
        showInviteModal,
        showLeaveModal,
        showEraseModal,
        showKickModal,
        showMuteModal,
        showBanModal,
		showJoinModal,
		showAdminModal,
        userChannels,
        settings
    } = useStore(state => state.chat);

    return (
        <div className='relative flex items-center justify-center h-screen w-screen bg-gray-900'>

            {/* Back Button */}
            <BackButton />
            {/* Create channel button */}
            {createOpen ? <CreateChat/> : null}
        
            {showInviteModal && <InviteUsers/>}
            {showLeaveModal && <LeaveChannel/>}
            {showEraseModal && <EraseChannel/>}

            {showAdminModal && <AdminModal/>}
            {showKickModal && <KickModal/>}
            {showMuteModal && <MuteModal/>}
            {showBanModal && <BanModal/>}


            {showJoinModal && <JoinModal/>}

            <div className='flex items-center justify-center gap-3 h-[700px] w-[1440px]'>
                {/* Left : User's channels / Joinable channels */}
                <div className='relative flex flex-col gap-3 h-full'>
                    <div className=' flex flex-col items-center justify-start bg-white rounded-xl shadow-md overflow-y-auto'>
                        {/* Button to create a channel */}
                        <CreateChannelButton/>
                        {/* Choose channels or join channels */}
                        <ToggleChannel/>
                        { userChannels ? <UserChannels/> : <JoinableChannels/> }
                    </div>
                </div>
                {/* Right : Chat */}
                { settings ? <Settings/> : <Discussion/> }
            </div>
        </div>
    )
}

export default Chat;