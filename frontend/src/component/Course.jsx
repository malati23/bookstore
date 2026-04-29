import React from 'react'
import list from "../assets/List.json"
import { Link } from 'react-router-dom'

function Course() {
  return (
    <div className='max-w-screen-2xl container mx-auto md:px-20 px-4'>
      
      {/* Heading */}
      <div className='mt-28 text-center justify-center'>
        <h1 className='text-2xl font-semibold md:text-4xl'>
          We are deligate to have <span className='text-pink-500'>Here!:</span>
        </h1>

        <p className='mt-10'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit...
        </p>

        <Link to={"/"}>
        <button className='bg-pink-500 text-white rounded-md px-2 py-2 hover:bg-pink-700 duration-300'>
          Back
        </button>
        </Link>
      </div>

      {/* Cards Section */}
      <div className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-6'>
        
        {list.map((item) => (
          <div key={item.id} className='border rounded-lg p-4 shadow-md hover:scale-105 duration-300'>
            
            <img src={item.image} alt="" className='w-full h-40 object-cover rounded-md' />
            
            <h2 className='text-lg font-semibold mt-2'>{item.name}</h2>
            
            <p className='text-gray-500'>{item.title}</p>

            <div className='flex justify-between items-center mt-3'>
              <span className='text-pink-500 font-bold'>₹{item.price}</span>
              <button className='bg-pink-500 text-white px-3 py-1 rounded-md hover:bg-pink-700'>
                Buy
              </button>
            </div>

          </div>
        ))}

      </div>
    </div>
  )
}

export default Course