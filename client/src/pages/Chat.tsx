import React, { useState, useEffect } from 'react';
import BackButton from '../components/BackButton';
import Settings from '../components/Chat/Settings';
import CreateChat from '../components/Chat/CreateChat';
import Discussion from '../components/Chat/Discussion';
import CreateChannelButton from '../components/Chat/CreateChannelButton';
import JoinableChannels from '../components/Chat/JoinableChannels';
import ToggleChannel from '../components/Chat/ToggleChannel';
import UserChannels from '../components/Chat/UserChannels';
import InviteUsers from '../components/Chat/InviteUsers';
import LeaveChannel from '../components/Chat/LeaveChannel';
import EraseChannel from '../components/Chat/EraseChannel';

interface User {
    id: string;
    username: string;
    role: string;
  }

interface Group {
  username: string;
}

const Chat: React.FC = () => {
    const [search, setSearch] = useState<string>('');
    const [createOpen, setCreateOpen] = useState<boolean>(false);
    const [settings, setSettings] = useState<boolean>(false);
    const [userChannels, setUserChannels] = useState<boolean>(true);
    const [groupType, setGroupType] = useState<string>('public');
    const [channelName, setChannelName] = useState<string>('');
    const [channelPassword, setChannelPassword] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [users, setUsers] = useState<any[]>([]);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showLeaveModal, setShowLeaveModal] = useState(false);
    const [showEraseModal, setShowEraseModal] = useState(false);

    // mock data
    const groups: Group[] = [
        { username: "Group 1" },
        { username: "Group 2" },
        { username: "Group 3" },
        { username: "Group 4" },
        { username: "Group 5" },
        { username: "Group 6" },
        { username: "Group 7" },
        { username: "Group 8" },
        { username: "Group 9" },
        { username: "Group 10" },
    ];

    // mock data
    const mockUsers: User[] = [
        { id: "1", username: "User 1", role: "creator" },
        { id: "2", username: "User 2", role: "admin" },
        { id: "3", username: "User 3", role: "member" },
        { id: "4", username: "User 4", role: "member" },
        { id: "5", username: "User 5", role: "member" },
        { id: "6", username: "User 6", role: "admin" },
        { id: "7", username: "User 7", role: "member" },
        { id: "8", username: "User 8", role: "member" },
        { id: "9", username: "User 9", role: "member" },
        { id: "10", username: "User 10", role: "admin" },
    ];
    
    useEffect(() => {
        setUsers(mockUsers);
    }, []);

    // useEffect(() => {
    //     // API call to get users
    //     getUsers()
    //     .then((users) => {
    //         setUsers(users);
    //     })
    //     .catch((err) => {
    //         // error
    //     })
    // })

    const kickUser = (id: any) => {
        // api call to kick user
    }

    const muteUser = (id: any) => {
        // api call to mute user
    }

    const banUser = (id: any) => {
        // api call to ban user
    }

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    }

    const handleGroupTypeChange = (groupType: string) => {
        setGroupType(groupType);
    }

    const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value);
    }

    return (
        <div className='relative flex items-center justify-center h-screen w-screen bg-gray-900'>

            {/* Back Button */}
            <BackButton />

            {
                createOpen ?
                    <CreateChat
                        setCreateOpen={setCreateOpen}
                        groupType={groupType}
                        handleGroupTypeChange={handleGroupTypeChange}
                        password={password}
                        handlePasswordChange={handlePasswordChange}
                    />
                : null
            }
        

            {showInviteModal && <InviteUsers setModal={() => setShowInviteModal(false)} />}
            {showLeaveModal && <LeaveChannel setModal={() => setShowLeaveModal(false)} />}
            {showEraseModal && <EraseChannel setModal={() => setShowEraseModal(false)} />}

            <div className='flex items-center justify-center gap-3 h-3/4 w-3/4'>

                {/* Left : User's channels / Joinable channels */}
                <div className='relative flex flex-col gap-3 h-full w-1/4'>
                
                    <div className=' flex flex-col items-center justify-start bg-white rounded-xl shadow-md overflow-y-auto'>
                    
                    {/* Button to create a channel */}
                    <CreateChannelButton setCreateOpen={setCreateOpen} />


                    {/* Choose channels or join channels */}
                    <ToggleChannel
                        userChannels={userChannels}
                        setUserChannels={setUserChannels}
                    />
                    {
                        userChannels ? 
                            <UserChannels
                                search={search}
                                handleSearchChange={handleSearchChange}
                                groups={groups}
                            />
                        :
                            <JoinableChannels
                                search={search}
                                handleSearchChange={handleSearchChange}
                                groups={groups}
                            />
                    }
                    </div>
                </div>

                {/* Right : Chat */}
                    {
                        settings ?
                            <Settings 
                                setSettings={setSettings} 
                                channelName={channelName} 
                                setChannelName={setChannelName} 
                                channelPassword={channelPassword} 
                                setChannelPassword={setChannelPassword} 
                                users={users} 
                                kickUser={kickUser} 
                                muteUser={muteUser} 
                                banUser={banUser}
                                setShowInviteModal={setShowInviteModal}
                                setShowLeaveModal={setShowLeaveModal}
                                setShowEraseModal={setShowEraseModal}
                            />
                        :
                            <Discussion setSettings={setSettings}/>
                    }
            </div>
        </div>
    )
}

export default Chat;