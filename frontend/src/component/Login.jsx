import React from 'react'
import { data, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form';
function Login() {
   const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data)=>console.log(data)
  return (
    <div>
      <dialog id="my_modal_3" className="modal">
  <div className="modal-box">
    <form onSubmit={handleSubmit(onSubmit)} method="dialog">
      {/* if there is a button in form, it will close the modal */}
      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
    </form>
    <h3 className="font-bold text-lg">Login</h3>
   <div className='mt-4 space-y-2'>
    <span>Email</span>
    <br/>
    <input type='email' placeholder='enter your email' className=' w-80 px-3 border rounded-md'
    {...register('email', { required: true })}></input>
   </div>
   {/* // passwprd */}
   <div className='mt-4 space-y-2'>
    <span>Password</span>
    <br/>
    <input type='email' placeholder='enter your email' className=' w-80 px-3 border rounded-md'
    {...register('password', { required: true })}></input>
   </div>
   {/* button */}
   <div className='flex justify-around mt-4'>
    <button className='bg-pink-500 text-white rounded-md px-3 py-2 hover:bg-pink-700 duration-200'>Login</button>
    <p>not registered?<Link to="/Signup" className='underline text-blue-500 cursor-pointer'>Signup</Link></p>
   </div>
  </div>
</dialog>
    </div>
  )
}

export default Login
