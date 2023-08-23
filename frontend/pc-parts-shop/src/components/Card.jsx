import React from 'react'

function Card({children}) {
  return (
    <div className='bg-white drop-shadow-md rounded-md overflow-hidden'>
        {children}
    </div>
  );
}

export default Card;