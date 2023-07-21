import React, { useEffect, useState } from 'react';
import { MdArrowForwardIos } from 'react-icons/md';
import HouseCard from './HouseCard';
import { useGetHousesQuery } from '../redux/services/latentAPI';

const Pagination = ({ totalHouses, housesPerPage, setCurrentPage, currentPage }) => {
  const pages = [];
  for (let i = 1; i <= Math.ceil(totalHouses / housesPerPage); i++) {
    pages.push(i);
  }
  // console.log({ pages }, { currentPage });
  return (
    <div className={`${pages.length > 1 ? 'flex' : 'hidden'} items-center justify-center gap-2 mt-8`}>
      <div className="bg-light_green border border-light_green cursor-pointer items-center px-2 py-2 rounded-full">
        <span className="transition-colors text-white hover:text-black">
          <MdArrowForwardIos
            style={{ color: 'gray', height: '16px', width: '16px', transform: 'rotate(180deg)' }}
          />
        </span>
      </div>
      {
        pages?.map((page) => (
          <div
            className={`bg-light_green border ${currentPage === page ? 'border-md_green' : 'border-light_green'}
            cursor-pointer items-center px-3 py-1 rounded-full`}
            key={page}
            onClick={() => setCurrentPage(page)}
          >
            <span
              className={`transition-colors text-green hover:text-black ${currentPage === page && 'text-black'} `}
            >{page}
            </span>
          </div>
        ))
      }
      <div className="bg-light_green border border-light_green cursor-pointer items-center px-2 py-2 rounded-full">
        <span className="transition-colors text-white hover:text-black">
          <MdArrowForwardIos
            style={{ color: 'gray', height: '16px', width: '16px' }}
          />
        </span>
      </div>
    </div>
  );
};

const PaginatedListing = ({ searchParams = {}, itemsPerPage, loggedIn = null, houses, isFetching, error }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [housesPerPage, setHousesPerPage] = useState(6);
  // const { data: houseResults, isFetching: loading, error: err } = useGetHousesQuery({ ...searchParams, pageNum: currentPage, pageSize: housesPerPage });
  const { data: houseResults, isFetching: loading, error: err } = useGetHousesQuery(searchParams);
  useEffect(() => {
    if (itemsPerPage) setHousesPerPage(Number(itemsPerPage));
  }, []);

  // console.log({ searchParams });
  if (isFetching || loading) return (<div><span>Loading houses...</span></div>);
  if (error || err) {
    if (err) console.log({ err });
    return (<div className="flex flex-col gap-2 w-full justify-center items-center h-full"><span>Something went wrong, try again.</span></div>);
  }
  // const currentHouses = Object.keys(searchParams).length ? houseResults?.data || [] : houses.data || houses;
  const currentHouses = Object.keys(searchParams).length ? houseResults?.data : houses.data || houses;
  // const currentHouses = houseResults?.data || (houses.data || houses);
  // console.log({ houseResults });
  const startIndex = currentPage === 1 ? (currentPage * housesPerPage) - housesPerPage : ((currentPage * housesPerPage) - 1) - housesPerPage;
  // console.log({ startIndex });
  return (
    <div className="items-center justify-center">
      <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
        {currentHouses?.slice(startIndex, housesPerPage).map((house, i) => (
          <HouseCard key={i} house={house} loggedIn={loggedIn} />
        ))}
        { !currentHouses.length && <div className="flex flex-col items-center justify-center"><span className="text-green">No listings to show...</span></div> }
      </div>
      <Pagination
        totalHouses={currentHouses.length}
        housesPerPage={housesPerPage}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
      />
    </div>
  );
};

export default PaginatedListing;
