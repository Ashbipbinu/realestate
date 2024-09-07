import React from "react";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
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
        <div className="flex justify-center items-center gap-3 font-[500]">
          <Link to="/">
            <ul className="hover:underline sm:hidden lg:block">Home</ul>
          </Link>
          <Link to="/about">
            <ul className="hover:underline sm:hidden lg:block">About</ul>
          </Link>
          <Link to="/signin">
            <ul className="hover:underline">SignIn</ul>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
