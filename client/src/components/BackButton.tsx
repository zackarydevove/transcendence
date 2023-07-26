import React from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function BackButton() {
  const navigate = useNavigate();

  return (
    <div>
        <button 
          className='absolute top-4 left-4 bg-indigo-500 text-white rounded-full p-2 hover:bg-white hover:text-indigo-500 transition'
          onClick={() => navigate(-1)}
        >
          <FaArrowLeft size={'1.4em'}/>
        </button>
    </div>
  )
}

export default BackButton
