import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Link } from "react-router-dom";
import { Swiper } from "swiper/react";
import { SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/swiper-bundle.css";
import ListingItem from "../components/ListingItem";

const Home = () => {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  const fetchSaleListing = async () => {
    try {
      const res = await fetch(`api/listing/get?type=sale&limit=4`);
      const data = await res.json();
      setSaleListings(data);
    } catch (error) {
      console.log;
    }
  };

  const fetchRentListing = async () => {
    try {
      const res = await fetch(`api/listing/get?type=rent&limit=4`);
      const data = await res.json();
      setRentListings(data);
      fetchSaleListing();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOfferListings = async () => {
    try {
      const res = await fetch(`api/listing/get?offer=true&limit=4`);
      const data = await res.json();
      setOfferListings(data);
      fetchRentListing();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* {top part} */}

      <div className="flex flex-col gap-2 p-28 px-4 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-xl lg:text-6xl">
          Find your <span className="text-slate-500">dream</span> with us.
        </h1>
        <br />
        <div className="text-slate-600 text-xs  sm:text-sm ">
          Rainbow Estate is the best place to find you next place to live.
          <br />
          We maybe the best option for you to rely on.
        </div>
        <div>
          <Link to="/search">
            <button className="text-xs sm:text-sm text-slate-600 font-bold hover:underline">
              Let's get started...
            </button>
          </Link>
        </div>
      </div>

      {/* central part */}
      <Swiper navigation={true}>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => {
            return (
              <SwiperSlide key={listing._id}>
                <div
                  style={{
                    background: `url(${listing?.imageUrls[0]}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                  className="h-[400px]"
                >

                </div>
              </SwiperSlide>
            );
          })}
      </Swiper>

      {/* Bottom part */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-6 my-10">
          {
            offerListings && offerListings.length > 0 && (
              <div>
                <div className="my-3">
                  <h2 className="text-2xl font-semibold text-slate-600">Recent Offers</h2>
                  <Link to={'/search?offer=true'} className="text-sm text-green-600">
                    Show more offers
                  </Link>
                </div>
                <div className="flex flex-wrap gap-3">
                  {
                    offerListings && offerListings.map(list => {
                      return (
                        <ListingItem list={list} key={list._id}/>
                      )
                    })
                  }
                </div>
              </div>
            )
          }
          {
            saleListings && saleListings.length > 0 && (
              <div>
                <div className="my-3">
                  <h2 className="text-2xl font-semibold text-slate-600">Recent places for sale</h2>
                  <Link to={'/search?type=sale'} className="text-sm text-green-600">
                    Show more recent places for sale
                  </Link>
                </div>
                <div className="flex flex-wrap gap-3">
                  {
                    saleListings && saleListings.map(list => {
                      return (
                        <ListingItem list={list} key={list._id}/>
                      )
                    })
                  }
                </div>
              </div>
            )
          }
          {
            rentListings && rentListings.length > 0 && (
              <div>
                <div className="my-3">
                  <h2 className="text-2xl font-semibold text-slate-600">Recent places for rents</h2>
                  <Link to={'/search?type=rent'} className="text-sm text-green-600">
                    Show more places for rent
                  </Link>
                </div>
                <div className="flex flex-wrap gap-3">
                  {
                    rentListings && rentListings.map(list => {
                      return (
                        <ListingItem list={list} key={list._id}/>
                      )
                    })
                  }
                </div>
              </div>
            )
          }
      </div>
    </div>
  );
};

export default Home;
