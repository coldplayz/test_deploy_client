import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormInput from '../components/FormInput';
import { useEditHouseMutation, useGetAllHousesQuery, useGetLoggedInUserQuery } from '../redux/services/latentAPI';

const EditHouse = () => {
  const navigate = useNavigate();
  const { houseId } = useParams();
  const { data: user, isFetching: loading, error: err } = useGetLoggedInUserQuery();
  const { data: houses, isFetching, error } = useGetAllHousesQuery();
  const house = (houses?.data || []).find((hse) => hse._id === houseId);

  const [editHouse, { isEditing }] = useEditHouseMutation();
  const emptyFile = new File([], 'empty');
  const [values, setValues] = useState({
    address: house.address,
    houseType: house.houseType,
    price: house.price,
    location: `${house.location.city}, ${house.location.state}, ${house.location.country}`,
    numRooms: house.numRooms,
    numFloors: house.numFloors,
    numBathrooms: house.numBathrooms,
    description: house.description,
    shared: house.shared ? 'Yes' : 'No',
    coverImage: emptyFile,
    images: null,
    name: house.name,
  });

  const inputs = [
    {
      id: 1,
      name: 'name',
      type: 'text',
      placeholder: 'House name',
      errorMessage:
        "House name should be 3-30 characters and shouldn't include any special character!",
      label: 'House Name',
      required: true,
    },
    {
      id: 2,
      name: 'address',
      type: 'text',
      placeholder: 'Address',
      errorMessage: 'Address should be a string of characters',
      label: 'Address',
      required: true,
    },
    {
      id: 3,
      name: 'houseType',
      type: 'text',
      placeholder: 'House type',
      label: 'House Type',
    },
    {
      id: 4,
      name: 'price',
      type: 'text',
      placeholder: 'Price range',
      errorMessage:
        'Price should be a range (two numbers) separated by a dash (-) eg 10000 - 15000',
      label: 'Price Range',
      required: true,
    },
    {
      id: 5,
      name: 'location',
      type: 'text',
      placeholder: 'City, state/county, country',
      errorMessage: 'Location must be 3 comma separated words',
      label: 'Location',
      required: true,
    },
    {
      id: 6,
      name: 'numRooms',
      type: 'number',
      placeholder: 'Bedrooms',
      errorMessage: 'Number of bedrooms must be a number, [0] for bedsitter',
      label: 'Number of bedrooms',
      required: true,
    },
    {
      id: 7,
      name: 'numBathrooms',
      type: 'number',
      placeholder: 'Bathrooms',
      errorMessage: 'Number of bathrooms must be a number',
      label: 'Number of bathrooms',
      required: true,
    },
    {
      id: 8,
      name: 'description',
      type: 'text',
      placeholder: 'House description',
      errorMessage:
        'Description should be a paragraph describing the house',
      label: 'House Description',
      // pattern: '^[A-Za-z0-9]{3,30}$',
      required: true,
    },
    {
      id: 9,
      name: 'shared',
      type: 'text',
      placeholder: 'Looking for a roomate? Yes or No',
      errorMessage:
        'Enter Yes or No',
      label: 'Share with roommate(s)?',
      required: true,
    },
    {
      id: 10,
      name: 'coverImage',
      type: 'file',
      placeholder: 'House image',
      errorMessage:
        'Upload an image of the house',
      label: 'House Image',
      required: false,
    },
    {
      id: 11,
      name: 'images',
      type: 'file',
      placeholder: 'more images',
      errorMessage:
        'Upload more images of the house',
      label: 'More House Images',
      required: false,
      multiple: true,
    },
  ];

  const [cover, otherImages] = inputs.slice(-2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...values };
    delete data.location;
    const [city, state, country] = values.location.split(',');
    data.city = city;
    data.state = state.split(' ')[1];
    data.country = country.split(' ')[1];
    data.shared = data.shared === 'Yes'.toLowerCase();
    data.electricity = true;
    data.water = true;
    data.numToilets = 2;
    data.numBathrooms = Number(data.numBathrooms);
    data.numRooms = Number(data.numRooms);
    data.numFloors = Number(data.numFloors);
    data.price = Number(data.price);
    data.id = houseId; // add houseId for routing
    console.log(data);
    if (!isEditing) {
      try {
        const formData = new FormData();
        Object.keys(data).forEach((key) => formData.append(key, data[key]));
        formData.delete('images'); // incorrectly set
        data.images?.slice(0, 3).map((image) => formData.append('images', image));
        // console.log(formData.get('numToilets'), formData.get('price'), formData.get('coverImage'), formData.get('images'));
        const res = await editHouse(formData).unwrap();
        console.log('edit house res: ', res);
        if (res.success) {
          toast.success('House edited successfully');
          // navigate back to user listings
          // navigate('/user');
        }
      } catch (err) {
        console.error('Failed to edit house: ', err);
        toast.error('House editing failed, try again...');
      }
      // navigate back to user listings
      navigate('/user');
    }
  };

  const onChange = (e) => {
    if (e.target.name === 'coverImage') {
      // console.log('coverImage: ', e.target.files[0]);
      setValues({ ...values, coverImage: e.target.files[0] });
    } else if (e.target.name === 'images') {
      // console.log('images: ', Array.from(e.target.files));
      setValues({ ...values, images: Array.from(e.target.files) });
    } else {
      setValues({ ...values, [e.target.name]: e.target.value });
    }
  };

  if (isFetching) return (<div><span>Loading house details...</span></div>);
  if (error) return (<div><span>Sorry, something went wrong. Try again later...</span></div>);
  if (!house) {
    return (
      <div className="w-full my-8 mx-2 md:mx-16 h-screen flex flex-col gap-2 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="text-slate-600 font-semibold">House not found</span>
          <span className="text-green transition-colors hover:text-md_green cursor-pointer" onClick={() => navigate('/explore')}>Continue exploring</span>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="w-full my-8 mx-2 md:mx-16 h-screen flex flex-col gap-2 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="text-slate-600 font-semibold">Loading ...</span>
        </div>
      </div>
    );
  }
  if (err) {
    return (
      <div className="w-full my-8 mx-2 md:mx-16 h-screen flex flex-col gap-2 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="text-slate-600 font-semibold">You must be logged in to access this page</span>
          <span className="text-green transition-colors hover:text-md_green cursor-pointer" onClick={() => navigate('/login')}>login</span>
        </div>
      </div>
    );
  }
  if (!user?.isAgent) {
    return (
      <div className="w-full my-8 mx-2 md:mx-16 h-screen flex flex-col gap-2 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="text-slate-600 font-semibold">You must be an agent to access this page</span>
          <span className="text-green transition-colors hover:text-md_green cursor-pointer" onClick={() => navigate('/explore')}>Continue exploring</span>
        </div>
      </div>
    );
  }
  return (
    <div className="flex w-full items-center justify-center my-8">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col px-4 md:px-16 md:items-start md:py-4 md:bg-white rounded-md md:w-2/3"
      >
        <h1 className="flex md:pl-0 gap-1 items-center py-4 text-lg font-semibold text-green">
          Edit house details
        </h1>
        {inputs.slice(0, -2).map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={input.type !== 'file' ? values[input.name] : ''}
            onChange={onChange}
          />
        ))}
        <FormInput
          {...cover}
          onChange={onChange}
        />
        <FormInput
          {...otherImages}
          onChange={onChange}
        />
        <div className="flex flex-col md:flex-row items-center gap-4 md:justify-between w-full">
          <button
            type="button"
            onClick={() => navigate('/user')}
            className="w-[280px] md:w-full mt-8 bg-green rounded-md text-white p-3
            transition-colors hover:bg-md_green"
          >Cancel
          </button>
          <button
            type="submit"
            className="w-[280px] md:w-full mt-8 bg-green rounded-md text-white p-3
            transition-colors hover:bg-md_green"
          >Edit
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditHouse;
