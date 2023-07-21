import React from 'react';
import { useNavigate } from 'react-router';
import { useDeleteHouseMutation } from '../redux/services/latentAPI';

const ConfirmDelete = ({ setShowModal, houseId }) => {
  const [deleteHouse, { isLoading }] = useDeleteHouseMutation();
  const navigate = useNavigate();

  const handleDelete = async () => {
    setShowModal(false); // close modal
    if (!isLoading) {
      try {
        const res = await deleteHouse(houseId);
        // console.log({ res });
        if (res.data.success) {
          alert('House deleted successfully');
        //   navigate('/user'); // back to myListings
        }
      } catch (error) {
        console.log('delete house failed: ', error);
      }
    }
  };
  return (
    <div className="absolute top-24 flex flex-col gap-3 p-4 bg-white shadow-lg z-10 rounded-md">
      <span className="text-s_gray font-semibold">Are you sure you want to delete this listing?</span>
      <div className="flex justify-between items-center cursor pointer">
        <span className="text-green bg-light_green border border-light_green p-1 px-2 rounded-md transition-colors hover:text-md_green cursor-pointer" onClick={() => setShowModal(false)}>Cancel</span>
        <span className="text-green bg-light_green border border-green p-1 px-2 rounded-md transition-colors hover:text-md_green cursor-pointer" onClick={handleDelete}>Delete</span>
      </div>
    </div>
  );
};

export default ConfirmDelete;
