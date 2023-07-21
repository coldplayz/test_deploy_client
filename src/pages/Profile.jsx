import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MdArrowForwardIos } from 'react-icons/md';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination } from 'swiper/modules';
import { TestimonialV2 } from '../components/Testimonial';
import PaginatedListing from '../components/PaginatedListing';
// import { altHouses } from '../constants';

import { useGetAgentQuery, useGetAllHousesQuery } from '../redux/services/latentAPI';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

// import required modules

const Profile = () => {
  const navigate = useNavigate();
  const { id: agentId } = useParams();
  console.log(agentId);
  // const agentId = '64ad8b37aaf270628b847598';
  const { data: agent, isFetching, error } = useGetAgentQuery(agentId);
  // filter agent listings from houseListings
  const { data: allHouses, isFetching: loading, error: err } = useGetAllHousesQuery();
  let agentHouses = null;

  if (isFetching) return (<div className="flex w-full h-screen items-center justify-center"><span className="text-green text-xl font-bold">Loading agent info...</span></div>);
  if (error) {
    console.log('get agent failed: ', error);
    // return (<div className="flex flex-col w-full h-screen items-center justify-center"><span>Sorry, something went wrong, try again later...</span><span className="text-green cursor-pointer hover:text-md_green" onClick={() => navigate(`/houses/${houseId}`)}>Go back</span></div>);
    return (<div className="flex flex-col w-full h-screen items-center justify-center"><span>Sorry, something went wrong, try again later...</span><span className="text-green cursor-pointer hover:text-md_green" onClick={() => navigate('/explore')}>Go back</span></div>);
  }
  console.log('agent: ', agent);
  if (!loading && !err) {
    // console.log({ allHouses });
    agentHouses = allHouses.data?.filter((house) => house.agentId === agentId);
    // console.log({ agentHouses });
  }
  return (
    <div className="flex flex-col border-green w-full mb-8 m-4 md:mx-16 overflow-hidden">
      <div className="flex flex-col gap-2">
        <Link
          to="/explore"
          className="flex items-center gap-1 font-semibold text-green transition-color
        hover:text-md_green cursor-pointer"
        >
          <MdArrowForwardIos
            style={{ color: 'green', height: '16px', width: '16px', transform: 'rotate(180deg)' }}
          />
          Back to Listings
        </Link>
        <span className="flex items-center gap-2 font-semibold text-[24px] md:text-[32px] text-slate-600">
          { `${agent.firstName} ${agent.lastName}`}
          <span className="text-sm p-1 px-2 bg-light_green">Agent</span>
        </span>
        <span className="text-sm text-s_gray transition-colors hover:text-md_green">
          <a href="#listings">{`${agentHouses.length} House Listings`}</a>
        </span>
      </div>
      <div className="flex flex-col space-y-8 my-8 py-8">
        <h2 className="text-lg text-s_gray text-center mb-8">What other clients have to say about
          <span className="px-1.5">{`${agent.firstName} ${agent.lastName}'s`}</span>
          services
        </h2>
        <div className="w-full overflow-hidden flex flex-col md:flex-row gap-4 md:gap-2">
          { agent.reviews.length ? (
            <Swiper
              slidesPerView={3}
              spaceBetween={10}
              freeMode
              pagination={{
                clickable: true,
              }}
              modules={[FreeMode, Pagination]}
              className="mySwiper"
            >
              {
                // [1, 2, 3, 4].map((review, i) => (
              agent.reviews?.map((review, i) => (
                <SwiperSlide key={i} className="rounded-md overflow-hidden">
                  <TestimonialV2 review={review} />
                </SwiperSlide>
              ))
          }
            </Swiper>
          ) : (
            <div className="w-full flex self-center justify-center items-center text-green">
              <span>No reviews yet...</span>
            </div>
          )}
        </div>
      </div>
      <div id="listings" className="flex flex-col md:mb-8">
        <h2 className="text-lg text-s_gray text-center">{`${agent.firstName} ${agent.lastName}'s listed vacancies`}</h2>
        { agentHouses ? (<PaginatedListing houses={agentHouses} itemsPerPage="3" />) : (
          <div><span>{`${agent.firstName} ${agent.lastName} has no listed houses for now...`}</span></div>) }
      </div>
    </div>
  );
};

export default Profile;
