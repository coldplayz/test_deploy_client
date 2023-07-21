import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdArrowForwardIos, MdLocationOn, MdPayment, MdPushPin, MdBedroomParent, MdBathroom, MdExpandMore, MdStar } from 'react-icons/md';
import { IoMdSend } from 'react-icons/io';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// import required modules
import { Navigation } from 'swiper/modules';

import PaginatedListing from '../components/PaginatedListing';
// import ConfirmDelete from '../components/ConfirmDelete';
import { altHouses } from '../constants';
import { currency } from '../constants';
import {
  useGetAllHousesQuery,
  useBookAppointmentMutation,
  useGetAgentQuery,
  useReviewAgentMutation,
  useGetLoggedInUserQuery,
  // useGetHouseImagesQuery,
} from '../redux/services/latentAPI';

const Rating = ({ setRating, rating, idx }) => {
  const [starred, setStarred] = useState(false);
  const handleClick = () => {
    setStarred(!starred);
    const newRating = [...rating];
    if (starred) {
      newRating[idx] = 0; // selected
      // console.log('de-selected');
    } else {
      newRating[idx] = 1; // selected
      // console.log('selected');
    }
    setRating(newRating);
  };

  return (
    <MdStar
      onClick={handleClick}
      style={{ color: starred ? '#339D65' : 'gray', height: '20px', width: '20px' }}
    />
  );
};

const House = () => {
  const navigate = useNavigate();
  const { houseId } = useParams();
  const { data: user, isFetching: gettingUser, error: userErr } = useGetLoggedInUserQuery();
  const { data: houses, isFetching, error } = useGetAllHousesQuery();
  const [bookAppointment, { booking }] = useBookAppointmentMutation();
  const [reviewAgent, { isReviewing }] = useReviewAgentMutation();
  const [booked, setBooked] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [rateAgent, setRateAgent] = useState(false);
  const [rating, setRating] = useState([0, 0, 0, 0, 0]);
  const [comment, setComment] = useState('');
  const [hovered, setHovered] = useState(false);
  // const [url, setUrl] = useState('');
  // const [urls, setUrls] = useState([]);

  // console.log(houseId)
  // console.log(houses.data);
  const house = houses?.data?.find((hse) => hse._id === houseId);
  // console.log({ houses });
  const similar = houses?.data.filter((hs) => hs._id !== houseId);

  const { data: agent, isFetching: loading, error: err } = useGetAgentQuery(house?.agentId);
  const images = house && Object.keys(house?.images).length ? house.images : altHouses[0].images;

  // if (loading) console.log('loading agent details in housePage');
  // if (err) console.log('loading agent details in housePage failed: ', err);
  // console.log({ agent });

  // determine if user (currently logged in) is the house owner && if owner, provide delete and edit actions
  const owner = !gettingUser && !userErr && user.listings?.includes(houseId);
  const inCart = !gettingUser && !userErr && user.cart?.includes(houseId);
  // const [showModal, setShowModal] = useState(false);
  const money = currency.filter((curr) => curr.CountryName.toLowerCase() === house.location.country.toLowerCase());

  const handleContactRequest = async () => {
    if (err) {
      toast.error('You have to be logged in to get contact info');
      navigate('/login');
    }
    if (!booking && !owner) {
      try {
        const res = await bookAppointment(houseId);
        console.log({ res });
        // if successful - alert user that they successfully booked at appointment - they should check their email... (toast)
        setBooked(true);
        toast.success('request recieved, check your email for the contact information');
      } catch (tryErr) {
        console.log('requesting contacts failed: ', tryErr);
      }
    }
    if (owner) {
      toast.warning('You are the house lister...');
    }
  };

  const handleCommenting = (e) => {
    if (!gettingUser && userErr) {
      toast.warning('You have to be logged in to review');
      navigate('/login');
    }
    setComment(e.target.value);
    // console.log(comment);
  };

  // console.log({ rating });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const stars = (rating.filter((i) => i === 1)).length;
    if (!isReviewing && !owner && comment) {
      const review = { comment, rating: stars };
      try {
        const res = await reviewAgent({ agentId: house.agentId, review });
        // console.log({ res });
        if (res.data.success) {
          toast.success('Review successfully submitted!');
          setComment(''); // clear textarea
          setRateAgent(false); // close the 'rating-box'
        }
      } catch (errr) {
        console.error('Reviewing failed: ', errr);
        toast.error(`Reviewing failed. Try again. ${!stars && 'At least one star required...'}`);
      }
    }
  };

  if (isFetching) return (<div><span>Loading house details ...</span></div>);
  if (error) return (<div><span>Something went wrong, try again later.</span></div>);
  if (!house) {
    return (
      <div className="w-full my-8 mx-2 md:mx-16 h-screen flex flex-col gap-2 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2">
          { !gettingUser && !userErr && user.isAgent ? (
            <><span className="text-slate-600 font-semibold">House deleted.</span><span className="text-green transition-colors hover:text-md_green cursor-pointer" onClick={() => navigate('/user')}>Back my listings</span></>
          ) : (
            <><span className="text-slate-600 font-semibold">House not found.</span><span className="text-green transition-colors hover:text-md_green cursor-pointer" onClick={() => navigate('/explore')}>Back to exploring</span></>
          )}
        </div>
      </div>

    );
  }

  return (
    <div className="flex flex-col border-green w-full mt-4 mx-2 md:mx-16">
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
          { house.houseType }
          { house.shared && <span className="text-sm text-green p-1 px-2 bg-light_green">Roommate needed</span> }
        </span>
        <span className="flex items-center gap-1 text-sm text-s_gray transition-colors hover:text-md_green">
          <MdLocationOn style={{ color: 'gray', height: '16px', width: '16px' }} />
          { house.address}
        </span>
      </div>

      {/* House Images and agent details */}

      {/* <div className="flex flex-col md:flex-row my-8 gap-2 border"> */}
      <div className="grid md:grid-cols-3 my-8 gap-2">
        {/* <div className="w-full flex flex-initial flex-col gap-2 border border-green"> */}
        <div className="md:col-span-2 gap-2 rounded-sm overflow-hidden">
          <div className="flex">
            { images?.length ? (
              <Swiper navigation modules={[Navigation]} className="mySwiper">
                {
                  images.map((image, i) => (
                    <SwiperSlide key={i}><img src={image} alt="house" className="min-h-[400px] max-h-[400px] object-cover h-full w-full bg-slate-300" /></SwiperSlide>
                  ))
                }
              </Swiper>
            ) : (
              <img src={house.coverImage} alt="house" className="max-h-[400px] object-cover w-full"/>
            )}
          </div>
          {/* agent details */}
          <div className="flex flex-col gap-4 bg-white mt-4 p-4">
            <div className="flex gap-2 text-sm">
              <span className="text-s_gray">Listed by</span>
              <span
                onClick={() => navigate(`/user/${house.agentId}`)}
                className="font-semibold text-slate-700 transition-colors hover:text-green cursor-pointer"
              >
                {!loading && !err ? `${agent.firstName} ${agent.lastName}` : 'listing agent loading...'}
              </span>
            </div>

            {/* Rate the agent's service */}

            <div className={`${owner ? 'hidden' : 'flex'} flex-col py-4`}>
              <div className="flex items-center gap-2">
                <span className="text-center text-green py-2 transition-colors
                hover:text-md_green cursor-pointer rounded-sm z-10"
                >
                  Rate the agent's services
                </span>
                <MdExpandMore
                  style={{ color: 'green', height: '24px', width: '24px' }}
                  onClick={() => setRateAgent(!rateAgent)}
                />
              </div>
              {
  rateAgent
                && (
                <form onSubmit={handleSubmit} className="flex flex-col md:mx-4 p-2 md:p-4">
                  <div className="flex items-center gap-1">
                    {rating.map((star, i) => (
                      <Rating
                        key={i}
                        rating={rating}
                        idx={i}
                        setRating={setRating}
                      />
                    ))}
                  </div>
                  <div className="flex items-end">
                    <textarea
                      name="comment"
                      id=""
                      cols="60"
                      rows="5"
                      value={comment}
                      // onChange={(e) => setComment(e.target.value)}
                      onChange={handleCommenting}
                      placeholder="leave a comment"
                      className="border mt-2 rounded p-2 text-slate-600 focus:outline-none focus:border-light_green"
                    />
                    <button type="submit" className="border-y border-x rounded px-4 py-2">
                      <IoMdSend
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                        style={{ color: hovered ? 'green' : 'gray', width: '20px', height: '20px' }}
                      />
                    </button>
                  </div>
                </form>
                )
}
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-slate-700">What other customers have to say about the Agent</span>
              <MdExpandMore
                style={{ color: 'gray', height: '24px', width: '24px' }}
                onClick={() => setShowReviews(!showReviews)}
              />
            </div>
            <div className={`flex flex-col gap-4 py-4 smooth-transition ${showReviews ? 'h-full opacity-1' : 'h-0 opacity-0'}`}>
              {
                !err && !loading ? (agent?.reviews?.map((review, i) => (
                  <div className="flex flex-col gap-2 justify-start text-sm pr-4 md:pr-16 pb-4 border-b" key={i}>
                    <span className="text-s_gray">{`“${review.comment}”`}</span>
                    <span className="self-end font-semibold text-s_gray">{`${review.user.firstName} ${review.user.lastName}`}</span>
                  </div>
                ))) : (
                  <span className="text-green">Loading...</span>
                )

}
            </div>
          </div>
        </div>

        {/* House Details */}

        <div className="w-full flex-1 flex flex-col py-2 px-4 bg-white rounded-sm">
          <div className="flex items-center gap-2 bg-light_green mt-2 p-2 rounded-sm">
            <MdPayment style={{ height: '20px', width: '20px', color: '#75BD97' }} />
            <span className="font-semibold text-green">{`${money[0].Symbol} ${house.price} /mth`}</span>
            <span className={`${house.shared ? 'flex' : 'hidden'} font-semibold text-white bg-green px-4 py-1`}>Per Individual</span>
          </div>
          <div className="flex items-center gap-2 mt-2 p-2">
            <MdPushPin style={{ height: '20px', width: '20px', color: '#75BD97' }} />
            <span className="text-s_gray">on the <span className="font-semibold">{`${house.numFloors}${house.numFloors === 1 ? 'st' : 'th'}`}</span> Floor</span>
          </div>
          <div className="flex items-center gap-2 p-2">
            <MdBedroomParent style={{ height: '20px', width: '20px', color: '#75BD97' }} />
            <span className="text-s_gray"><span className="font-semibold">{house.numRooms}</span> Bedrooms</span>
          </div>
          <div className="flex items-center gap-2 p-2">
            <MdBathroom style={{ height: '20px', width: '20px', color: '#75BD97' }} />
            <span className="text-s_gray"><span className="font-semibold">{house.numBathrooms}</span> Bathrooms</span>
          </div>
          <span className="py-4 font-semibold text-slate-600">About this House</span>
          <span className="text-s_gray text-sm">{ house.description || 'Located in one of the safest areas of Nairobi, the apartment comes with  reliable piped water, complimentary borehole water and reliable electricity supply. Garbage collection and cleaning services are readily and affordably available. We have  a children playground in the compound as well as a mall just outside...' }</span>
          <div className={`${owner || inCart ? 'hidden' : 'flex'} flex-col gap-1 py-16`}>
            <span className="text-sm text-s_gray">interested?</span>
            <span
              className="text-center text-white bg-green px-4 py-2 transition-colors
            hover:text-light_green cursor-pointer rounded-sm"
              onClick={handleContactRequest}
            >
              Request for agent contact Information
            </span>
          </div>
          <div className={`${inCart ? 'flex' : 'hidden'} flex-col gap-1 py-16`}>
            <span
              className="text-center text-white bg-green px-4 py-2 transition-colors
            hover:text-light_green cursor-pointer rounded-sm"
              onClick={() => navigate('/user/cart')}
            >
              Already in your cart, see what else is in there...
            </span>
          </div>
          <div className={`${owner ? 'flex' : 'hidden'} flex-col md:flex-row md:justify-between items-center gap-1 py-16 relative`}>
            {/* <span
              className="text-center text-green bg-light_green px-4 py-2 transition-colors
            hover:text-md_green cursor-pointer rounded-sm"
              onClick={() => setShowModal(true)}
            >
              Delete House
            </span>
            { showModal && <ConfirmDelete houseId={houseId} setShowModal={setShowModal} /> } */}
            <span
              className="text-center text-green bg-light_green px-4 py-2 transition-colors
            hover:text-md_green cursor-pointer rounded-sm"
              onClick={() => navigate(`/edit/${houseId}`)}
            >
              Edit house details
            </span>
          </div>
        </div>
      </div>

      {/* Similar listings page */}

      <div id="listings" className="flex flex-col py-8 md:mb-8 md:-mx-16 bg-light_green">
        <h2 className="text-lg font-semibold text-slate-600 text-center md:text-start md:px-16">Similar listings</h2>
        <PaginatedListing houses={similar} itemsPerPage="3" />
      </div>
    </div>
  );
};

export default House;

