import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import ClipLoader from "react-spinners/ClipLoader";
import ListingItem from "../components/ListingItem";

const Search = () => {
  const { searchTerm } = useSelector((state) => state.searchTerm);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState([]);
  const [showMore, setShowMore] = useState(false)
  const [sideBarData, setSideBarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  const fetchListing = async (urlParams) => {
    setLoading(true);
    setShowMore(false);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    console.log(data.length)
    if(data.length > 8){
      setShowMore(true)
    }else {
      setShowMore(false);
    }
    setLoading(false);
    setListing(data);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromURL = urlParams.get("searchTerm");
    const typeFromURL = urlParams.get("type");
    const parkingFromURL = urlParams.get("parking");
    const furnishedFromURL = urlParams.get("furnished");
    const offerFromURL = urlParams.get("offer");
    const sortFromURL = urlParams.get("sort");
    const orderFromURL = urlParams.get("order");

    if (
      searchTermFromURL ||
      typeFromURL ||
      parkingFromURL ||
      furnishedFromURL ||
      offerFromURL ||
      sortFromURL ||
      orderFromURL
    ) {
      setSideBarData({
        searchTerm: searchTermFromURL || "",
        type: typeFromURL || "all",
        parking: parkingFromURL === "true" ? true : false,
        furnished: furnishedFromURL === "true" ? true : false,
        offer: offerFromURL === "true" ? true : false,
        sort: sortFromURL || "created_at",
        order: orderFromURL || "desc",
      });
    }
    // if (searchTerm) {
    //   setSideBarData({ ...sideBarData, searchTerm: searchTerm });
    // }
    fetchListing(urlParams);
  }, [location.search, searchTerm]);

 

  const handleChange = (e) => {
    const { id, checked, value } = e.target;
    if (id === "all" || id === "rent" || id === "sale") {
      setSideBarData({ ...sideBarData, type: id });
    }

    if (id === "parking" || id === "furnished" || id === "offer") { 
      setSideBarData({
        ...sideBarData,
        [id]: checked || checked === "true" ? true : false,
      });
    }

    if (id === "sort_order") {
      const sort = value.split("_")[0] || "created_at";
      const order = value.split("_")[1] || "desc";
      setSideBarData({ ...sideBarData, sort, order });
    }
  };

  const handleSearchSubmission = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", searchTerm);
    urlParams.set("type", sideBarData.type);
    urlParams.set("parking", sideBarData.parking);
    urlParams.set("furnished", sideBarData.furnished);
    urlParams.set("offer", sideBarData.offer);
    urlParams.set("sort", sideBarData.sort);
    urlParams.set("order", sideBarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listing.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if(data.length < 9){
      setShowMore(false)
    }
    setListing([...listing, ...data])
  }

  return (
    <div className="md:flex">
      <div className="flex  flex-col gap-7 p-6 border-b-2 md:border-r-2 md:min-h-screen">
        <h1 className="font-bold text-3xl mt-2 text-center md:text-start">Advanced Search</h1>
        <form onSubmit={handleSearchSubmission} className="flex flex-col gap-7">
          <div className="flex flex-wrap items-center gap-4">
            <label className="font-bold">Type:</label>
            <div className="flex gap-3">
              <input
                type="checkbox"
                className="w-4"
                id="all"
                onChange={handleChange}
                checked={sideBarData.type === "all"}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-3">
              <input
                type="checkbox"
                className="w-4"
                id="rent"
                onChange={handleChange}
                checked={sideBarData.type === "rent"}
              />
              <span>Rent</span>
            </div>{" "}
            <div className="flex gap-3">
              <input
                type="checkbox"
                className="w-4"
                id="sale"
                onChange={handleChange}
                checked={sideBarData.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-3">
              <input
                type="checkbox"
                className="w-4"
                id="offer"
                onChange={handleChange}
                checked={sideBarData.offer === true}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <label className="font-bold">Aminities:</label>
            <div className="flex gap-3">
              <input
                type="checkbox"
                className="w-4"
                id="parking"
                onChange={handleChange}
                checked={sideBarData.parking === true}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-3">
              <input
                type="checkbox"
                className="w-4"
                id="furnished"
                onChange={handleChange}
                checked={sideBarData.furnished === true}
              />
              <span>Furnished</span>
            </div>{" "}
          </div>
          <div className="flex items-center gap-4">
            <label className="font-bold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              id="sort_order"
              className="border-2  rounded-lg p-2"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>
      <div className="relative">
        <h2 className="text-3xl font-bold border-b-4 p-5 md:p-3 md:mt-5 mt-0 text-center md:text-start">
          Listing results:
        </h2>
        {!loading ? (
          <div className="flex flex-wrap gap-4 p-7">
            {listing.length === 0 && (  
              <p className="p-4 font-semibold">No listing found!</p>
            )
            }
            {
              listing && listing.map((list) => {
                return (
                  <ListingItem key={list._id} list={list}/>
                )
              })
            }
          <div className="w-full">
          {
            showMore && listing.length > 0 && (
              <button
              className="text-green-700 hover:underline p-7 ml-5"
              onClick={onShowMoreClick}
              >Show more</button>
            )
          }
          </div>
          </div>
        ) : (
          <div className="flex justify-center items-center m-10">
            <ClipLoader size={50} color={"#6b7280"} loading={true} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
