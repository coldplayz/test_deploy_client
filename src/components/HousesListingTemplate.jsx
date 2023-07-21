import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Filter, MobileFilter } from './Filter';
import PaginatedListing from './PaginatedListing';

const HousesListingTemplate = ({ header, subHeader, leaveLink, houses, isFetching, error, setUseMap, toMap }) => {
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  return (
    <div className="w-full my-8 mx-2 md:mx-16">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-16 mb-8">
        <h1 className="text-xl text-green font-bold text-center md:text-start">
          { header || 'Explore Houses, find one that fits your needs and budget' }
        </h1>
        {
            toMap ? (
              <span
                className="hidden md:flex p-1 md:p-2 border-b border-md_green md:border-none hover:border-green md:px-4
                md:bg-white text-green rounded-sm cursor-pointer transition-colors hover:text-md_green"
                onClick={() => setUseMap(true)}
              >
                { leaveLink || 'Go to map' }
              </span>
            ) : (
              <Link
                to="/explore"
                className="hidden md:flex p-1 md:p-2 border-b border-md_green md:border-none hover:border-green md:px-4
                 md:bg-white text-green rounded-sm cursor-pointer transition-colors hover:text-md_green"
                onClick={() => {}}
              >
                { leaveLink || 'Back to Listings' }
              </Link>
            )
        }
        <span
          className="md:hidden p-1 border-b border-md_green text-green rounded-sm cursor-pointer transition-colors hover:text-md_green"
          onClick={() => setShowMobileFilter(true)}
        >
          Filter listing
        </span>
      </div>
      <div className="flex items-center justify-center">
        <Filter setSearchParams={setSearchParams} />
        { showMobileFilter && <MobileFilter setShowMobileFilter={setShowMobileFilter} /> }
      </div>
      <div className="flex flex-col md:mt-8">
        <h2 className="hidden md:block text-green text-center md:text-start">{ subHeader || 'Currently listed vacancies'} <span>{`(${houses?.data?.length || houses?.length} total)`}</span></h2>
        <PaginatedListing searchParams={searchParams} houses={houses} isFetching={isFetching} error={error} />
      </div>
    </div>
  );
};

export default HousesListingTemplate;
