import React from 'react'
import { Link } from 'react-router-dom'
import Login from './Login'

function Signup() {
  return (
    <div className='flex justify-center h-screen items-center'>
      
      <div className='relative bg-white p-5 rounded-md shadow-md'>
        
        {/* Close Button */}
        <Link to={"/"} className="absolute right-2 top-2 text-xl font-bold cursor-pointer hover:text-red-500">
          ✕
        </Link>

        <h3 className="font-bold text-lg">Login</h3>

        <div className='mt-4 space-y-2'>
          <span>Name</span><br/>
          <input type='text' className='w-80 px-3 border rounded-md' />
        </div>

        <div className='mt-4 space-y-2'>
          <span>Email</span><br/>
          <input type='email' className='w-80 px-3 border rounded-md' />
        </div>

        <div className='mt-4 space-y-2'>
          <span>Password</span><br/>
          <input type='password' className='w-80 px-3 border rounded-md' />
        </div>

        <div className='flex justify-around mt-4'>
          <button className='bg-pink-500 text-white rounded-md px-3 py-2 hover:bg-pink-700'
          >
            Login
          </button>

          <p>
            not registered?
            <button className='underline text-blue-500 ml-1'
            onClick={()=> document.getElementById("my_modal_3").showModal()}
            >
              Login
            </button>
            <Login/>
          </p>
        </div>

      </div>

    </div>
  )
}

export default Signup