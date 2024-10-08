import React from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase/firebase.config";
import { signInFailure, signInSuccess } from "../../redux/Slices/userSlide";
import { useDispatch } from "react-redux";
import  {useNavigate} from 'react-router-dom'

const OAuth = () => {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleAuth = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);
    
        const result = await signInWithPopup(auth, provider);
    
        const res = await fetch("/api/auth/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: result.user.displayName,
            email: result.user.email,
            photo: result.user.photoURL,
          }),
        });
    
        const data = await res.json();
        if(data.success === false){
          dispatch(signInFailure(data.error))
          return
        }
        dispatch(signInSuccess(data));
        navigate('/')
    } catch (error) {
        console.log(error)
    }
  };
  return (
    <button
      type="button"
      className="bg-red-700 text-white p-4 rounded-lg font-semibold uppercase "
      onClick={handleGoogleAuth}
    >
      Continue with google
    </button>
  );
};

export default OAuth;
