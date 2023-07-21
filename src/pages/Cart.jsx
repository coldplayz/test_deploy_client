import React from 'react';
import { useNavigate } from 'react-router';
import HousesListingTemplate from '../components/HousesListingTemplate';
import { useGetAllHousesQuery, useGetLoggedInUserQuery } from '../redux/services/latentAPI';

const Cart = () => {
  const navigate = useNavigate();
  const { data, isFetching, error } = useGetAllHousesQuery();
  const { data: user, isFetching: loading, error: userErr } = useGetLoggedInUserQuery();
  let houses = [];

  if (!loading && !userErr && !isFetching && !error) {
    houses = data.data?.filter((house) => user?.cart?.includes(house._id));
    // console.log({ houses });
  }
  if (loading || isFetching) {
    return (
      <div className="w-full my-8 mx-2 md:mx-16 h-screen flex flex-col gap-2 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="text-slate-600 font-semibold">Loading ...</span>
        </div>
      </div>
    );
  }
  if (userErr) {
    return (
      <div className="w-full my-8 mx-2 md:mx-16 h-screen flex flex-col gap-2 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="text-slate-600 font-semibold">You must be logged in to access this page</span>
          <span className="text-green transition-colors hover:text-md_green cursor-pointer" onClick={() => navigate('/login')}>Login</span>
        </div>
      </div>
    );
  }
  return (
    <HousesListingTemplate
      houses={houses}
      header="Here are your favorites, ready to make a decision?"
    // useMap={useMap}
      leaveLink="Back to Exploring"
      subHeader="Your favorites"
    />
  );
};

export default Cart;
