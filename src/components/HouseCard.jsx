import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdPinDrop, MdPayment, MdBathroom, MdBedroomParent, MdGroupAdd } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useDeleteHouseMutation, useGetLoggedInUserQuery } from '../redux/services/latentAPI';
import { altHouses } from '../constants';
import { currency } from '../constants';

const ConfirmModal = ({ setShowModal, handleDelete }) => (
  <div className="absolute top-12 flex flex-col gap-3 p-4 bg-white shadow-lg z-10 rounded-md">
    <span className="text-s_gray font-semibold">Are you sure you want to delete this listing?</span>
    <div className="flex justify-between items-center">
      <span className="text-green bg-light_green border border-light_green p-1 px-2 rounded-md transition-colors hover:text-md_green" onClick={() => setShowModal(false)}>Cancel</span>
      <span className="text-green bg-light_green border border-green p-1 px-2 rounded-md transition-colors hover:text-md_green" onClick={handleDelete}>Delete</span>
    </div>
  </div>
);

const HouseCard = ({ house }) => {
  const navigate = useNavigate();
  // const user = useSelector((state) => state.user.user);
  const { data: user, isFetching, error } = useGetLoggedInUserQuery();
  const [deleteHouse, { isLoading }] = useDeleteHouseMutation();

  const [showModal, setShowModal] = useState(false);

  const handleDelete = async () => {
    setShowModal(false); // close modal
    if (!isLoading) {
      try {
        const res = await deleteHouse(house._id);
        // console.log({ res });
        if (res.data.success) {
          toast.success('House deleted successfully');
        }
      } catch (err) {
        console.log('delete house failed: ', err);
        toast.error('failed to delete, try again.');
      }
    }
  };
  const random = Math.floor(Math.random() * (4 - 1)) + 1;
  const altImage = altHouses[0].images[random - 1];
  // console.log({ house });
  const money = currency.filter((curr) => curr.CountryName.toLowerCase() === house.location.country.toLowerCase());
  // console.log({ money });

  return (
    <div
      className="w-[320px] flex flex-col h-[400px] rounded-md bg-white relative transition-shadow hover:shadow-md cursor-pointer"
    >
      {/* <img src={altImage} alt="house" className="h-2/4 object-cover rounded-t-md bg-slate-300" /> */}
      <img src={house.coverImage || altImage} alt="house" className="h-2/4 object-cover rounded-t-md bg-slate-300" />
      <div className="absolute z-1 top-2 left-2 bg-white text-green text-sm flex items-center rounded-sm">
        <span
          onClick={() => navigate(`/houses/${house._id || house.id}`)}
          className="px-2 py-1 border-r transition-colors hover:text-md_green cursor-pointer"
        >
          See more
        </span>
      </div>
      {!isFetching && !error && user?.listings?.includes(house._id) && (
      <div className="absolute z-1 top-2 right-2 bg-white text-green text-sm flex items-center rounded-sm">
        <span className="px-2 py-1 border-r transition-colors hover:text-md_green cursor-pointer" onClick={() => navigate(`/edit/${house._id || house.id}`)}>Edit</span>
        <span className="px-2 py-1 border-l transition-colors hover:text-md_green cursor-pointer" onClick={() => setShowModal(true)}>Delete</span>
      </div>
      ) }
      <div className="flex flex-col p-4 gap-2 text-s_gray">
        <h1 className="font-semibold text-slate-500 py-2">{ house.name ? `${`${house.name} ${house.houseType}`}` : `${house.numRooms} Bedroom ${house.houseType}`}</h1>
        <p className="flex items-center space-x-2">
          <span><MdPayment style={{ height: '20px', width: '20px', color: '#75BD97' }} className="inline-block" /></span>
          <span className="text-md ">{`${money[0].Symbol} ${house.price}/mth`}</span>
        </p>
        <p className="flex items-center space-x-2">
          <span><MdPinDrop style={{ height: '20px', width: '20px', color: '#75BD97' }} className="inline-block" /></span>
          <span className="text-sm">{ `${`${house.address}, ${house.location.state}`}`}</span>
        </p>
        <div className="flex border-t mt-4 py-4">
          <p className="border-r flex-1 flex justify-start items-center gap-2 text-sm">
            <span><MdBedroomParent style={{ height: '20px', width: '20px', color: '#75BD97' }} className="inline-block" /></span>
            {house.numRooms} Bedrooms
          </p>
          <p className="border-l flex-1 flex justify-end items-center gap-2 text-sm">
            <span><MdBathroom style={{ height: '20px', width: '20px', color: '#75BD97' }} className="inline-block" /></span>
            {house.numBathrooms} Bathrooms
          </p>
        </div>
        {/* roommate flag */}
        {house.shared && (
        <div className="absolute top-[170px] -right-2 bg-green text-white text-sm px-4 pr-6 py-1 flex items-center space-x-2 rounded-md">
          <span><MdGroupAdd style={{ height: '20px', width: '20px', color: 'white' }} className="inline-block" /></span>
          <span>Roommates</span>
        </div>
        ) }
      </div>
      { showModal && <ConfirmModal setShowModal={setShowModal} handleDelete={handleDelete} />}
    </div>
  );
};

export default HouseCard;
