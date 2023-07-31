import React, { ChangeEvent, useState } from 'react';

interface MuteModalProps {
    setModal: (val: boolean) => void;
}

const MuteModal: React.FC<MuteModalProps> = ({ setModal }) => {
    const [minutes, setMinutes] = useState(1);

    // const handleMute = (e) => {

    // }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMinutes(Number(e.target.value));
    }

    return (
        <div className='absolute z-20 top-0 left-0 w-screen h-screen bg-black bg-opacity-40 flex justify-center items-center'
            onClick={() => setModal(false)}>
            <div className='z-30 relative w-1/4 bg-white rounded-xl p-8 pt-0'
                onClick={(e) => e.stopPropagation()}>
                {/* Form for muting the user */}
                <div className='mt-5'>
                    <div className='mb-4'>
                        <label htmlFor="muteDuration" className="block text-gray-700 text-sm font-bold mb-2">Duration (minutes):</label>
                        <input  className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500' 
                                id="muteDuration" 
                                type="number" 
                                value={minutes}
                                onChange={handleChange}
                        />
                    </div>

                    <button className='w-full py-2 px-4 rounded-md bg-indigo-500 text-white hover:bg-indigo-600'>
                            {/* onClick={() => handleMute(minutes)}> */}
                        Mute User
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MuteModal;
