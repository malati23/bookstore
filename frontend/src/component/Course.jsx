import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBooks } from '../api/bookApi'; // Import the API function to fetch books

function Course() {
  console.log("Component Rendered: Course.jsx");

  // State to store the list of books fetched from MongoDB
  const [bookList, setBookList] = useState([]);
  
  // State to handle the loading UI
  const [loading, setLoading] = useState(true);
  
  // State to handle any errors during fetching
  const [error, setError] = useState(null);

  // useEffect runs when the component mounts to fetch books
  useEffect(() => {
    console.log("useEffect Running in Course.jsx");

    const fetchBooks = async () => {
      console.log("Fetching Books...");
      try {
        // Fetch books using our configured Axios API
        const data = await getBooks();
        console.log("API Response (data):", data);

        setBookList(data); // Store fetched data in state
        console.log("Books State after set:", data);
        
        setLoading(false); // Turn off loading indicator
      } catch (err) {
        console.error("API Error in Course.jsx:", err);
        setError("Failed to fetch books. Please try again later."); // Set error message
        setLoading(false); // Turn off loading even on error
      }
    };

    fetchBooks();
  }, []); // Empty dependency array ensures this runs only once

  // Show loading state while fetching data
  if (loading) {
    return <div className="text-center mt-28 text-2xl font-semibold">Loading books...</div>;
  }

  // Show error message if API fails
  if (error) {
    return <div className="text-center mt-28 text-2xl font-semibold text-red-500">{error}</div>;
  }

  return (
    <div className='max-w-screen-2xl container mx-auto md:px-20 px-4'>
      
      {/* Heading */}
      <div className='mt-28 text-center justify-center'>
        <h1 className='text-2xl font-semibold md:text-4xl'>
          We are deligate to have <span className='text-pink-500'>Here!:</span>
        </h1>

        <p className='mt-10'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit...
        </p>

        <Link to={"/"}>
        <button className='bg-pink-500 text-white rounded-md px-2 py-2 hover:bg-pink-700 duration-300'>
          Back
        </button>
        </Link>
      </div>

      {/* Cards Section */}
      <div className='mt-12 grid grid-cols-1 md:grid-cols-3 gap-6'>
        
        {/* Render books using the fetched bookList instead of static JSON data */}
        {bookList.map((item) => (
          <div key={item._id} className='border rounded-lg p-4 shadow-md hover:scale-105 duration-300'>
            
            <img src={item.image} alt="" className='w-full h-40 object-cover rounded-md' />
            
            <h2 className='text-lg font-semibold mt-2'>{item.title || item.name}</h2>
            
            <p className='text-gray-500'>{item.category || item.title}</p>

            <div className='flex justify-between items-center mt-3'>
              <span className='text-pink-500 font-bold'>₹{item.price}</span>
              <button className='bg-pink-500 text-white px-3 py-1 rounded-md hover:bg-pink-700'>
                Buy
              </button>
            </div>

          </div>
        ))}

      </div>
    </div>
  )
}

export default Course