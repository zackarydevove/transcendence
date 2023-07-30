import React, { FC } from 'react';

interface KickModalProps {
    setModal: (val: boolean) => void;
}

const KickModal: FC<KickModalProps> = ({ setModal }) => {

    return (
        <div className='absolute z-20 top-0 left-0 w-screen h-screen bg-black bg-opacity-40 flex justify-center items-center'
            onClick={() => setModal(false)}>
            <div className='z-30 relative w-1/4 bg-white rounded-xl p-8 pt-0'
                onClick={(e) => e.stopPropagation()}>
                {/* Confirmation for kicking the user */}
                <div className='mt-5'>
                    <p className='mb-4 text-center'>Are you sure you want to kick this user?</p>

                    <button className='w-full py-2 px-4 rounded-md bg-indigo-500 text-white hover:bg-indigo-600'>
                            {/* onClick={handleKick}> */}
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}

export default KickModal;
