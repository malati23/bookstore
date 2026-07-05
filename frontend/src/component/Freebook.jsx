import React, { useEffect, useState } from "react";
import { formatCurrency } from '../utils/currency';

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

// Import the API client to fetch real data from MongoDB
import { getBooks } from "../api/bookApi";

function Freebook() {
  console.log("Component Rendered: Freebook.jsx");

  const [bookList, setBookList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("useEffect Running in Freebook.jsx");

    const fetchFreeBooks = async () => {
      console.log("Fetching Books in Freebook...");
      try {
        const data = await getBooks();
        console.log("API Response (data) in Freebook:", data);

        // Filter only books where category is "Free"
        const filterdata = data.filter((item) => item.category === "Free");
        setBookList(filterdata);
        console.log("Filtered Free Books State:", filterdata);

        setLoading(false);
      } catch (err) {
        console.error("API Error in Freebook:", err);
        setError("Failed to fetch free courses");
        setLoading(false);
      }
    };

    fetchFreeBooks();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading free courses...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-screen-2xl mx-auto px-4">
      <h1 className="text-xl font-semibold mb-4">
        Free Offered Courses
      </h1>

      <Swiper
        spaceBetween={20}
        slidesPerView={4}
      >
        {bookList.map((item) => (
          // FIX: Use item._id (MongoDB's unique ID) as the key.
          // We add a fallback to item.id just in case static data is ever passed.
          <SwiperSlide key={item._id || item.id} >
            <div className="bg-white rounded p-4 mt-4 my-4 bg-base-100 shadow-xl">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-40 object-cover"
              />

              <h2 className="mt-2 font-semibold">{item.title || item.name}</h2>
              <div className="card-actions justify-between mt-3">
                <div className="badge badge-outline">{formatCurrency(item.price)}</div>
                <div className="cursor-pointer px-2 py-1 rounded-full border-[2px] hover:bg-pink-500 hover:text-white duration-200">
                  Buy Now
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Freebook;
