import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector} from'react-redux'

const Header = () => {

  const { currentUser } = useSelector(state => state.user)

  return (
    <header className="bg-slate-200 shadow-md flex-1">
      <div className="flex justify-between items-center mx-auto p-4 max-w-6xl">
        <Link to="/">
          <h1 className="sm:text-xl flex flex-wrap font-bold">
            <span className="text-slate-500">Rainbow</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form className="bg-slate-300 rounded-lg flex justify-center items-center flex-row-reverse px-2">
          <input
            placeholder="Search..."
            className="outline-none bg-transparent p-2 lg:w-[500px] w-[300px]"
          />
          <FaSearch className="text-slate-600" />
        </form>
        <div>
          <ul className="flex justify-center items-center gap-4 font-[500]">
            <Link to="/">
              <li className="hover:underline sm:hidden lg:block">Home</li>
            </Link>
            <Link to="/about">
              <li className="hover:underline sm:hidden lg:block">About</li>
            </Link>
            <Link to="/profile">
              {currentUser ? <img className="rounded-full h-7 w-7 object-cover" src={currentUser.avatar} alt='profile'/> : <li className="hover:underline">SignIn</li>}
            </Link>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
