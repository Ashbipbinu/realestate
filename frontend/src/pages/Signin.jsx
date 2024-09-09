import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { signInStart, signInSuccess, signInFailure } from '../../redux/Slices/userSlide';
import { useDispatch, useSelector } from 'react-redux'
import OAuth from '../components/OAuth';


const Signin = () => {

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const {error, loading} = useSelector(state => state.user)
  console.log("error", error)

  const  [formData, setFormData] = useState({});

  
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
      dispatch(signInStart())
      const res = await fetch("/api/auth/signin", 
        {
        method: "POST",
        headers: {
          "Content-Type" : 'application/json'
        },
        body: JSON.stringify(formData)
      }
    );
      const data = await res.json();
      console.log(data)
      if(data.success === false){
        dispatch(signInFailure(data.error))
        return
      }
      dispatch(signInSuccess(data))
      navigate('/')
     } catch (error) {
       dispatch(signInFailure(error))
     }
  }

  return (
    <div className='p-3 max-w-lg mx-auto '>
      <h1 className="text-center text-3xl my-3 font-semibold">
        Sign In
      </h1>
      <form className='flex flex-col gap-4' onChange={handleChange}>
        <input autoComplete='off' type="email" placeholder="Email" name="email" className='border p-3 rounded-lg'/>
        <input autoComplete='off' type="password" placeholder="Password" name="password" className='border p-3 rounded-lg'/>
        <button onClick={handleSubmit} className='bg-slate-700 p-4  rounded-lg text-white font-semibold hover:bg-slate-500 uppercase'>
          {loading ? "Loading" : "Login"}
        </button>
      <OAuth/>
      </form>
      <div>
        <p>Dont't have an account?<Link to='/signup'><span className='text-blue-500 cursor-pointer'> Sign up</span></Link></p>
      </div>
      {/* {error && <p className='text-red-500'>{error}</p>} */}
    </div>
  )
}

export default Signin