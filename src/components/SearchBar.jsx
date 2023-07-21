import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { Autocomplete } from '@react-google-maps/api';

import Button from './Button';

const SearchBar = ({ name, isLoaded }) => {
  const navigate = useNavigate();
  const locationRef = useRef();
  const [agent, setAgent] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  // const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // setLocation(locationRef.current?.value);
    const data = {};
    if (agent) {
      const [first, last] = agent.split(' ');
      data['agentFirstname'] = first;
      data['agentLastname'] = last;
    }
    const location = locationRef.current.value;
    if (location) {
      const [city, state, country] = location.split(',')
      data['city'] = city;
      data['state'] = state;
      data['country'] = country;
    }
    data['priceRange'] = priceRange;
    data['numRooms'] = bedrooms;
    // console.log(data.get('location'), locationRef.current.value);
    console.log('search parameters: ', data);
    // clear form fields
    setAgent('');
    setBedrooms('');
    // setLocation('');
    setPriceRange('');
    navigate('/explore');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row bg-white p-4 border border-light_green"
    >
      <div className="flex flex-col space-y-2 md:space-y-0 mb-2 md:mb-0 md:flex-row md:mr-2">
        <input
          type="text"
          placeholder="Agent full name"
          id="agentName"
          name="agentName"
          value={agent}
          // value={filters.agentName}
          // onChange={handleInput}
          onChange={(e) => setAgent(e.target.value)}
          className="border pl-2 text-sm text-green focus:outline-none"
        />
        <input
          type="text"
          id="bedrooms"
          placeholder="Number of rooms"
          // value={filters.numRooms}
          // onChange={handleInput}
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          className="border pl-2 text-sm text-green focus:outline-none"
        />
        { isLoaded && (
        <Autocomplete className="">
          <input
            type="text"
            placeholder="Location"
            ref={locationRef}
            // value={location}
            // onChange={(e) => setLocation(e.target.value)}
            className="border w-full h-full pl-2 text-sm text-green focus:outline-none"
          />
        </Autocomplete>
        )}

        <input
          type="text"
          placeholder="Price"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="border pl-2 text-sm text-green focus:outline-none"
        />
      </div>
      {/* <Link to="/explore"> */}
      <button type="submit">
        <Button name={(name && name) || 'Search'} />
      </button>
      {/* </Link> */}
    </form>
  );
};

export default SearchBar;
