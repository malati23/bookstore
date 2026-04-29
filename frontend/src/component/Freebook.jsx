// import React from 'react'
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// import list from "../assets/List.json"

// function Freebook() {
//     const filterdata= list.filter((data)=> data.category === "Free");
//     console.log(filterdata);
//    var settings = {
//     dots: true,
//     infinite: false,
//     speed: 500,
//     slidesToShow: 3,
//     slidesToScroll: 3,
//     initialSlide: 0,
//     responsive: [
//       {
//         breakpoint: 1024,
//         settings: {
//           slidesToShow: 2,
//           slidesToScroll: 3,
//           infinite: true,
//           dots: true
//         }
//       },
//       {
//         breakpoint: 600,
//         settings: {
//           slidesToShow: 2,
//           slidesToScroll: 2,
//           initialSlide: 2
//         }
//       },
//       {
//         breakpoint: 480,
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1
//         }
//       }
//     ]
//   };
//   console.log("Slider =", Slider);
//   return (
//     <>
//     <div className='max-w-screen-2xl container mx-auto md:px-20 px-4 '>
//       <div>
//         <h1 className='font-semibold text-xl pb-2'>Free Offered Courses</h1>
//       <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nesciunt id facere et incidunt, quos soluta voluptatem quae, reiciendis quidem minima quia voluptas autem, 
//         tenetur neque. Molestiae earum quo quibusdam tenetur 
//         eligendi voluptatem dicta eos!</p>
//       </div>
       
//     </div>
//     <div>
//      <div className="max-w-screen-2xl mx-auto px-4 mt-6">
//   <Slider {...settings}>
//     {filterdata.map((item) => (
//       <div key={item.id} className="p-2">
//         <div className="bg-white shadow-md rounded-lg p-4">
//           <img
//             src={item.image}
//             alt={item.title}
//             className="w-full h-40 object-cover rounded"
//           />
//           <h2 className="mt-2 font-semibold">{item.title}</h2>
//           <p className="text-sm text-gray-500">{item.name}</p>
//         </div>
//       </div>
//     ))}
//   </Slider>
// </div>
//     </div>
        
//         </>
    
//   )
// }

// export default Freebook;.
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import list from "../assets/List.json";

function Freebook() {
  const filterdata = list.filter((data) => data.category === "Free");

  return (
    <div className="max-w-screen-2xl mx-auto px-4">
      <h1 className="text-xl font-semibold mb-4">
        Free Offered Courses
      </h1>

      <Swiper
        spaceBetween={20}
        slidesPerView={4}
      >
        {filterdata.map((item) => (
          <SwiperSlide key={item.id} >
            <div className="bg-white  rounded p-4 mt-4 my-4 bg-base-100 shadow-xl">
              <img
                src={item.image}
                alt=""
                className="w-full h-40 object-cover"
              />

              <h2 className="mt-2">{item.title}</h2>
              <div className="card-actions justify-between">
                <div className=" badge badge-outline">${item.price}</div>
              <div className="cursor-pointer px-2 py-1 rounded-full border-[2px] hover:bg-pink-500 hover:text-white duration-200">Buy Now</div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Freebook;
