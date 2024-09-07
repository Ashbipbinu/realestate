import React from 'react'
import { Link } from 'react-router-dom'

const Signup = () => {
  return (
    <div className='p-3 max-w-lg mx-auto '>
      <h1 className="text-center text-3xl my-3 font-semibold">
        Sign Up
      </h1>
      <form className='flex flex-col gap-3'>
        <input type='text' autoComplete="off" placeholder="Username" className='border p-3 rounded-lg ' id="username"/>
        <input type='Email' autoComplete="off"  placeholder="Email" className='border p-3 rounded-lg ' id="Email"/>
        <input type='password' autoComplete="off" placeholder="password" className='border p-3 rounded-lg ' id="password"/>
        <button className='bg-slate-700 p-4 rounded-lg text-white uppercase font-semibold hover:bg-slate-500 disabled:bg-slate-300 disabled:text-black'>Sign up</button>
      </form>
      <div>
        <p>Have an accound?<Link to='/signin'><span className='text-blue-500 cursor-pointer'> Login in</span></Link></p>
      </div>
    </div>
  )
}

export default Signup