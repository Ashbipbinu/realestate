import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useSelector} from'react-redux'

const Header = () => {

  const { currentUser } = useSelector(state => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate()
  const handleSearch = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    console.log(searchQuery)
    navigate(`/search/${searchQuery}`);
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermURL = urlParams.get('searchTerm');
    if(searchTermURL){
      setSearchTerm(searchTermURL);
    }
  }, [location.search])

  return (
    <>
      <header className="bg-slate-200 shadow-md w-full">
      <div className="flex justify-between items-center mx-auto p-4 max-w-6xl">
        <Link to="/">
          <h1 className="sm:text-xl sm:flex flex-wrap font-bold hidden">
            <span className="text-slate-500">Rainbow</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>
        <form onSubmit={handleSearch} className="bg-slate-300 rounded-lg flex justify-center items-center flex-row-reverse px-2">
          <input
            placeholder="Search..."
            className="outline-none bg-transparent p-2 lg:w-[500px] w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
          <FaSearch className="text-slate-600" />
          </button>
        </form>
        <div>
          <ul className="flex justify-center items-center sm:gap-4 gap-0 font-[500]">
            <Link to="/">
              <li className="hover:underline hidden lg:block">Home</li>
            </Link>
            <Link to="/about">
              <li className="hover:underline hidden lg:block">About</li>
            </Link>
            <Link to="/profile">
              {currentUser ? <img className="rounded-full h-7 w-7  object-cover" src={currentUser.avatar} alt='profile'/> : <li className="hover:underline">SignIn</li>}
            </Link>
          </ul>
        </div>
      </div>
    </header>
    <Outlet/>
    </>
  );
};

export default Header;
