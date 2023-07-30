import React from 'react';
import { BiPlus } from "react-icons/bi";

interface CreateChannelButtonProps {
    setCreateOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateChannelButton: React.FC<CreateChannelButtonProps> = ({ setCreateOpen }) => {
    return (
        <button 
            className='absolute top-1 -left-16 p-2 rounded-full bg-indigo-500 text-white hover:bg-white hover:text-indigo-500 transition flex items-center justify-center'
            onClick={() => setCreateOpen(true)}
        >
            <BiPlus size='1.7em'/>
        </button>
    )
}

export default CreateChannelButton;
