import React from 'react'
import Navebar from '../Navebar'
import Footer from '../Footer'
import Course from '../Course'
import list from "../../assets/List.json";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

// import list from "../assets/List.json";
function Courses() {
    console.log(list)
  return (
    <div>
      <Navebar/>
      <div className='min-h-screen'>
      <Course/>
      </div>
      
      <Footer/>
    </div>
  )
}

export default Courses
