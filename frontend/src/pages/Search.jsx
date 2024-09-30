import React from "react";

const Search = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      <div className="flex  flex-col gap-7 p-6 border-b-2 md:border-r-2 md:min-h-screen">
        <h1 className="font-bold text-3xl ">Advanced Search</h1>
        <form className="flex flex-col gap-7">
          <div className="flex flex-wrap items-center gap-4">
            <label className="font-bold">Type:</label>
            <div className="flex gap-3">
              <input type="checkbox" className="w-4" id="all" />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-3">
              <input type="checkbox" className="w-4" id="rent" />
              <span>Rent</span>
            </div>{" "}
            <div className="flex gap-3">
              <input type="checkbox" className="w-4" id="sale" />
              <span>Sale</span>
            </div>
            <div className="flex gap-3">
              <input type="checkbox" className="w-4" id="offer" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <label className="font-bold">Aminities:</label>
            <div className="flex gap-3">
              <input type="checkbox" className="w-4" id="parking" />
              <span>Parking</span>
            </div>
            <div className="flex gap-3">
              <input type="checkbox" className="w-4" id="furnished" />
              <span>Furnished</span>
            </div>{" "}
          </div>
          <div className="flex items-center gap-4">
            <label className="font-bold">Sort:</label>
            <select id="sort_order" className="border-2  rounded-lg p-2">
                <option>Price high to low</option>
                <option>Price low to high</option>
                <option>Latest</option>
                <option>Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">Search</button>
        </form>
      </div>
      <div>
        <h2 className="text-3xl font-bold border-b-4 p-3 text-slate-700 mt-5">Listing results:</h2>
      </div>
    </div>
  );
};

export default Search;
