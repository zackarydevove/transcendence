import React from 'react'

interface CreateChatProps {
    setCreateOpen: (val: boolean) => void;
    groupType: string;
    handleGroupTypeChange: (type: string) => void;
    password: string;
    handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}


const CreateChat: React.FC<CreateChatProps> = ({ 
    setCreateOpen, 
    groupType, 
    handleGroupTypeChange, 
    password, 
    handlePasswordChange 
}) => {
  return (
    <div className='absolute z-20 top-0 left-0 w-screen h-screen bg-black bg-opacity-40 flex justify-center items-center'
        onClick={() => setCreateOpen(false)}>
        <div className='z-30 relative w-1/4 h-[330px] bg-white rounded-xl p-8 pt-0'
            onClick={(e) => e.stopPropagation()}>
            {/* Form for creating a new group */}
            <div className='mt-5'>
                <div className='mb-4'>
                    <label htmlFor="groupName" className="block text-gray-700 text-sm font-bold mb-2">Group Name:</label>
                    <input  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500' 
                            id="groupName" 
                            type="text" 
                            placeholder="Enter group name" 
                    />
                </div>

                <div className='mb-4 flex'>
                    <div 
                        className={`p-4 text-center hover:cursor-pointer flex-grow ${groupType === 'public' ? 'bg-indigo-500 text-white' : 'hover:bg-gray-200 text-indigo-500'}`} 
                        onClick={() => handleGroupTypeChange('public')}>
                        <p>PUBLIC</p>
                    </div>
                    <div 
                        className={`p-4 text-center hover:cursor-pointer flex-grow ${groupType === 'protected' ? 'bg-indigo-500 text-white' : 'hover:bg-gray-200 text-indigo-500'}`} 
                        onClick={() => handleGroupTypeChange('protected')}>
                        <p>PROTECTED</p>
                    </div>
                    <div 
                        className={`p-4 text-center hover:cursor-pointer flex-grow ${groupType === 'private' ? 'bg-indigo-500 text-white' : 'hover:bg-gray-200 text-indigo-500'}`} 
                        onClick={() => handleGroupTypeChange('private')}>
                        <p>PRIVATE</p>
                    </div>  
                </div>

                {groupType === 'protected' && 
                    <div className='mb-4'>
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500' 
                                id="password" 
                                type="password" 
                                placeholder="Enter channel's password" 
                                value={password}
                                onChange={handlePasswordChange}
                        />
                    </div>
                }

                <button className='w-full py-2 px-4 rounded-md bg-indigo-500 text-white hover:bg-white hover:text-indigo-500 hover:border hover:border-indigo-500'>
                    Create Group
                </button>
            </div>
        </div>
    </div>
  )
}

export default CreateChat
