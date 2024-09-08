import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Signup = () => {

  const navigate = useNavigate()

  const  [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) =>{
    event.preventDefault();
    const { name, value } = event.target;
    setFormData(prevEl => {
      return {
        ...prevEl,
        [name] : value
      }
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
     try {
      setIsLoading(true)
      const res = await fetch('http://localhost:3000/api/auth/signup', 
        {
        method: "POST",
        headers: {
          "Content-Type" : 'application/json'
        },
        body: JSON.stringify(formData)
      }
    );
      const data = await res.json();
      if(!data.success){
        setIsLoading(false)
        setError(data.error)
        return
      }
      setIsLoading(false)
      navigate("/signin")
     } catch (error) {
       console.log("error", error)
     }
  }

  return (
    <div className='p-3 max-w-lg mx-auto '>
      <h1 className="text-center text-3xl my-3 font-semibold">
        Sign Up
      </h1>
      <form className='flex flex-col gap-4' onChange={handleChange}>
        <input autoComplete='off' type="text" placeholder="Username" name="username"  className='border p-3 rounded-lg'/>
        <input autoComplete='off' type="email" placeholder="Email" name="email" className='border p-3 rounded-lg'/>
        <input autoComplete='off' type="password" placeholder="Password" name="password" className='border p-3 rounded-lg'/>
        <button onClick={handleSubmit} className='bg-slate-700 p-4  rounded-lg text-white font-semibold hover:bg-slate-500 uppercase'>
          {isLoading ? "Loading" : "Sign up"}
        </button>
      </form>
      <div>
        <p>Have an account?<Link to='/signin'><span className='text-blue-500 cursor-pointer'> Login in</span></Link></p>
      </div>
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  )
}

export default Signup