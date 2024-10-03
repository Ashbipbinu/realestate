import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

const ListingItem = ({ list }) => {
  return (
    <div className="overflow-hidden w-[300px]  bg-white shadow-md hover:shadow-lg transition-shadow rounded-lg mx-auto md:mx-0">
      <Link to={`/listing/${list._id}`}>
        <img
          src={list.imageUrls[0] || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjI15y47ob5nKxohuTqg2o96UFvYHoq_hvvg&s"}
          alt="listing cover"
          className=" sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="text-lg font-semibold text-slate-700 truncate">
            {list.name}
          </p>
          <div className="flex items-center gap-2 ">
            <MdLocationOn className="h-4 w-4 text-green-700" />
            <p className="truncate">{list.address}</p>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">
            {list.description}
          </p>
          <p className="text-slate-500 mt-2 font-semibold flex items-center">
            ${' '}
            {list.offer
              ? list.discountPrice.toLocaleString("en-US")
              : list.regularPrice.toLocaleString("en-US")}
              {list.type === 'rent' && '/month'}
          </p>
          <div className="text-slate-700 flex  gap-3">
            <div className="font-bold text-xs">
                {list.bedrooms > 1 ? `${list.bedrooms} beds` : `${list.bedrooms} bed`}
            </div>
            <div className="font-bold text-xs">
                {list.bathrooms > 1 ? `${list.bathrooms} bathrooms` : `${list.bathrooms} bathroom`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingItem;
