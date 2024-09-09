import React from 'react'
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router';

const PrivateRoute = () => {

    const { currentUser } = useSelector(state => state.user);
    console.log(currentUser)

  return currentUser ? <Outlet/> : <Navigate to={'/signin'}/>
    
  
}

export default PrivateRoute