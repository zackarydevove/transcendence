import React, { FC } from 'react';

interface EraseChannelProps {
    setModal: (val: boolean) => void;
}

const EraseChannel: FC<EraseChannelProps> = ({ setModal }) => {
    const handleEraseChannel = () => {
        // implement the logic to erase the channel
    }

    return (
        <div className='absolute z-20 top-0 left-0 w-screen h-screen bg-black bg-opacity-40 flex justify-center items-center'
            onClick={() => setModal(false)}>
            <div className='z-30 relative w-1/4 bg-white rounded-xl p-8 pt-0'
                onClick={(e) => e.stopPropagation()}>
                {/* Confirmation for erasing the channel */}
                <div className='mt-5'>
                    <p className='mb-4 text-center'>Are you sure you want to erase this channel?</p>

                    <button className='w-full py-2 px-4 rounded-md bg-indigo-500 text-white hover:bg-indigo-600'
                            onClick={handleEraseChannel}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EraseChannel;
