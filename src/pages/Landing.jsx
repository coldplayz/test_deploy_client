import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BsLinkedin, BsFacebook, BsTwitter, BsInstagram } from 'react-icons/bs';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

// import required modules
import { FreeMode, Pagination } from 'swiper/modules';

import SearchBar from '../components/SearchBar';
import { card1, card2 } from '../assets';
import Button from '../components/Button';
import HouseCard from '../components/HouseCard';
import { Testimonial } from '../components/Testimonial';

import { useGetAllHousesQuery } from '../redux/services/latentAPI';

// import { altHouses } from '../constants';

const Landing = ({ isLoaded }) => {
  const { data, isFetching, error } = useGetAllHousesQuery();
  return (
  <div className="w-full relative">

    {/* Hero section */}

    <div id="hero" className="flex flex-col md:flex-row bg-hero-bg bg-cover md:h-[700px]">
      {/* Left */}
      <div className="flex-1 bg-gradient-to-r from-bg_color via-bg_color to-bg-transparent pl-4 md:pl-16 py-16">
        <h1 className="font-bold text-[32px] md:text-[40px]">Hunt for Your next House Smarter, Quicker, Cheaper & Anywhere</h1>
        <p className="text-s_gray flex items-center py-24">
          <span className="font-bold text-[24px] text-green px-2 border-l-2">20k+</span>
          listed houses
        </p>
        <div className="hidden md:flex absolute">
          <SearchBar isLoaded={isLoaded} />
        </div>
        <div className="flex md:hidden">
          <Link to="/explore">
            <Button name="Dive in to searching" />
          </Link>
        </div>
      </div>
      {/* Right */}
      <div className="hidden flex-1 md:flex flex-col">
        <div className="flex">
          <img src={card1} alt="house1" className="h-[400px]" />
        </div>
        <div className="flex justify-end pr-4">
          <img src={card2} alt="house2" className="" />
        </div>
      </div>
    </div>

    {/* Services section */}

    <div id="services" className="bg-white border border-white">
      <div className="flex flex-col my-16 mx-2 md:mx-16">
        <h1 className="text-center font-semibold text-[24px] text-green p-1">Our Services</h1>
        <p className="text-center text-sm text-s_gray">We make it easy and convenient for both landlords (& agents) and tenants</p>
        <div className="flex flex-col md:flex-row text-center mt-16 gap-8">
          {/* Tenants */}
          <div className="flex-1 flex flex-col space-y-4">
            {/* <h2><span className='pr-1 pb-1 border-b-2 border-green'>For</span>Tenants</h2> */}
            <h2 className="w-full p-1 bg-light_green rounded-sm">Tenants</h2>
            <div className="flex flex-col space-y-2 py-4 p-2">
              <h1 className="text-lg font-semibold text-slate-700">A new way to find your next home</h1>
              <p className="text-sm text-s_gray">No longer dread trying to find your dream home.  Easily and quickly find a house you love by exploring
                our listed houses in the locations of your choosing and with the features you most desire  then contact
                the agent and make the necessary arrangements to physically investigate the house.
              </p>
            </div>
            <div className="flex flex-col space-y-2 py-4 p-2">
              <h1 className="text-lg font-semibold text-slate-700">A convenient way to find a roommate</h1>
              <p className="text-sm text-s_gray">
                Are you a student looking to save some cash by co-renting? Easily find a shared house to co-rent. No - You don’t have to be a student,
                explore co-renting options and see if you like some....
              </p>
            </div>
            <div className="flex justify-center">
              <Link to="/explore">
                <Button name="Explore" type="secondary" />
              </Link>
            </div>
          </div>

          {/* Agents & landlords */}

          <div className="flex-1 flex flex-col space-y-4">
            {/* <h2><span className='pr-1 pb-1 border-b-2 border-green'>For</span>Agents & landlords</h2> */}
            <h2 className="w-full p-1 bg-light_green rounded-sm">Agents & landlords</h2>
            <div className="flex flex-col space-y-2 py-4 p-2">
              <h1 className="text-lg font-semibold text-slate-700">A new way to find tenants</h1>
              <p className="text-sm text-s_gray">Make your houses visible to thousands of house hunters by posting them on
                the site whenever they become vacant. Advertise your houses and attract the best of tenants...
              </p>
            </div>
            <div className="flex flex-col space-y-2 py-4 p-2">
              <h1 className="text-lg font-semibold text-slate-700">A convenient way to find a roommate</h1>
              <p className="text-sm text-s_gray">
                Have a house and want to save some cash by rent sharing? Post your house and get a roommate hustle-free
              </p>
            </div>
            <div className="flex justify-center">
              <Link to="/houses/new">
                <Button name="Try it out" type="light" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Houses listing section */}
    <div id="explore" className="flex flex-col my-16 md:mx-16">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-center font-semibold text-[24px] text-green p-1">Listed Houses</h1>
        <p className="text-center text-sm text-s_gray">See the currently listed vacancies just in your current location</p>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-8">
        {!error && !isFetching && data.data?.slice(0, 6).map((house, i) => <HouseCard key={i} house={house} roommate="true" />)}
        {/* <HouseCard loggedIn="true" /> */}
      </div>
      <div className="flex justify-end items-center p-8">
        <Link to="/explore" className="mr-12 transition-colors hover:text-green cursor-pointer">see more ...</Link>
      </div>
    </div>

    {/* Testimonials section */}
    <div className="flex flex-col bg-white">
      <div className="flex flex-col my-16 mx-2 md:mx-16">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-center font-semibold text-[24px] text-green p-1">What our customers say?</h1>
          <p className="text-center text-sm text-s_gray">Don't take our word for it, hear directly from our customer landlords, agents  and clients.</p>
        </div>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-16">
          <Swiper
            slidesPerView={2}
            spaceBetween={10}
            freeMode
            pagination={{
              clickable: true,
            }}
            modules={[FreeMode, Pagination]}
            className="mySwiper"
          >
            {
         [1, 2, 3, 4, 5, 6].map((review, i) => (
           <SwiperSlide key={i}>
             <Testimonial />
           </SwiperSlide>
         ))
        }
          </Swiper>
        </div>
      </div>
    </div>

    {/* Contact us section */}
    <div id="contacts" className="flex flex-col m-16">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-center font-semibold text-[24px] text-green p-1">Contact Us</h1>
        <p className="text-center text-sm text-s_gray">We like hearing from our customers, write to us</p>
      </div>
    </div>

    {/* Footer section */}
    <div className="flex flex-col bg-green">
      <div className="flex flex-col md:flex-row gap-4 md:justify-between text-white m-16 mb-12">
        <div className="flex flex-col space-y-8">
          <span className="text-lg">Latent</span>
          <div className="flex space-x-4">
            <BsFacebook style={{ height: '20px', width: '20px' }} />
            <BsLinkedin style={{ height: '20px', width: '20px' }} />
            <BsTwitter style={{ height: '20px', width: '20px' }} />
            <BsInstagram style={{ height: '20px', width: '20px' }} />
          </div>
          <div className="flex">
            <Button type="light" name="Contact us" />
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <span className="text-lg">Navigation</span>
          <span className="text-sm">Home</span>
          <span className="text-sm">Services</span>
          <span className="text-sm">Contact us</span>
        </div>
        <div className="flex flex-col space-y-2">
          <span className="text-lg">Company</span>
          <span className="text-sm">About us</span>
          <span className="text-sm">Our mission and vision</span>
          <span className="text-sm">Our team</span>
        </div>
        <div className="flex flex-col space-y-2">
          <span className="text-lg">Support</span>
          <span className="text-sm">Contact us</span>
          <span className="text-sm">Login</span>
        </div>
      </div>
      <div className="flex justify-center text-white mb-4">
        <span className="text-sm">Copyright &copy; 2023. All rights reserved.</span>
      </div>
    </div>

  </div>
)};

export default Landing;
