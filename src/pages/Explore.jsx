import React, { useEffect, useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';

// import { GoogleMap, Marker } from '@react-google-maps/api';
import HouseCard from '../components/HouseCard';
import HousesListingTemplate from '../components/HousesListingTemplate';
import { useGetAllHousesQuery } from '../redux/services/latentAPI';

const MapFilter = () => (
  <div className="flex items-center justify-between">
    <div className="flex space-x-2 p-2 px-4">
      <input type="text" placeholder="Agent full name" className="border rounded-md text-center text-sm text-green focus:outline-none" />
      <input type="text" placeholder="Number of rooms" className="border rounded-md text-center text-sm text-green focus:outline-none" />
      <input type="text" placeholder="Location" className="border rounded-md text-center text-sm text-green focus:outline-none" />
      <input type="text" placeholder="Price range" className="border rounded-md text-center text-sm text-green focus:outline-none" />
    </div>
  </div>
);

const MapVersion = ({ setUseMap, isLoaded, houses }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [hovered, setHovered] = useState(false);

  const [coords, setCoords] = useState({});
  const [map, setMap] = useState(/** @type google.maps.Map */ (null));

  // set initial map center as the user's location (as per their browser geo-locator)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      setCoords({ lat: latitude, lng: longitude });
    });
    console.log({ coords });
  }, []); // set only once -- hence no dependencies

  return (
    <div className="hidden w-full md:flex flex-col mt-8 mx-16">
      <h1 className="text-xl text-green font-bold mb-8">
        Explore houses, find one that fits your needs and budget
      </h1>
      <div className="flex gap-4 max-h-screen mb-16">
        <div className="flex flex-col gap-2 w-full h-full overflow-auto">
          {houses?.map((house, i) => (
            <HouseCard key={i} house={house} />
          ))}
        </div>
        {/* the map */}

        <div className="flex flex-col w-full bg-white border-2 border-light_green rounded-md">
          {
            isLoaded ? (
              <>
                <div className="flex flex-col mb-4">
                  <div className="w-full mt-2 capitalize">
                    <div className="flex justify-end items-center gap-2 px-4 mb-4">
                      <span
                        onClick={() => setShowFilter(true)}
                        className="bg-white px-4 py-1 rounded-sm text-green transition-colors hover:text-md_green cursor-pointer shadow-sm"
                      >
                        + Add filters
                      </span>
                      <span
                        onClick={() => setUseMap(false)}
                        className="bg-white px-4 py-1 rounded-sm text-green transition-colors hover:text-md_green cursor-pointer shadow-sm"
                      >
                        Close map
                      </span>
                    </div>
                    <div className={`smooth-transition ${showFilter ? 'opacity-100 h-100' : 'opacity-0 h-0'} flex justify-center md:min-w-[790px] w-full border-y`}>
                      <div className="flex items-center bg-white p-2 ">
                        <MapFilter />
                        <span className="">
                          <AiOutlineClose
                            style={{ color: hovered ? 'black' : 'green', height: '20px', width: '20px' }}
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                            onClick={() => setShowFilter(false)}
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center bg-hero-bg bg-cover w-full h-full">
                  <span className="text-red">To be implemented soon...</span>
                </div>
                {/* <GoogleMap
                  center={coords.lat && coords.lng && coords}
                  zoom={15}
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  options={{
                    zoomControl: false,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: false,
                  }}
                  onLoad={(map) => setMap(map)}
                >
                  { coords.lat && coords.lng && <Marker position={coords} /> }
                </GoogleMap> */}
              </>
            ) : (
              <div className="flex items-center justify-center">
                <span>Loading map....</span>
              </div>
            )
          }

          <div className="flex" />
        </div>
      </div>
    </div>
  );
};

const Explore = ({ isLoaded }) => {
  // const [useMap, setUseMap] = useState(true);
  const [useMap, setUseMap] = useState(false);
  const toMap = true;
  const { data: houses, isFetching, error } = useGetAllHousesQuery();

  if (useMap) return <MapVersion setUseMap={setUseMap} isLoaded={isLoaded} houses={houses.data} />;
  return (
    <HousesListingTemplate
      houses={houses}
      isFetching={isFetching}
      error={error}
      header=""
      useMap={useMap}
      setUseMap={setUseMap}
      leaveLink=""
      subHeader=""
      toMap={toMap}
    />
  );
};

export default Explore;
