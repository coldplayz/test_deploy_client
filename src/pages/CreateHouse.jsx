import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormInput from '../components/FormInput';
import { useGetLoggedInUserQuery, usePostHouseMutation } from '../redux/services/latentAPI';

const CreateHouse = () => {
  const navigate = useNavigate();
  const { data: user, isFetching, error } = useGetLoggedInUserQuery();
  const [values, setValues] = useState({
    name: '',
    address: '',
    houseType: '',
    price: '',
    location: '',
    numRooms: '',
    numBathrooms: '',
    numFloors: '',
    description: '',
    shared: '',
    coverImage: [],
    images: [],
    altImages: [],
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
      name: 'numFloors',
      type: 'number',
      placeholder: 'Floor number',
      errorMessage: 'Floor number must be a number',
      label: 'Floor number',
      required: true,
    },
    {
      id: 11,
      name: 'coverImage',
      type: 'file',
      placeholder: 'House image',
      errorMessage:
        'Upload an image of the house',
      label: 'House Image',
      required: true,
    },
    {
      id: 12,
      name: 'images',
      type: 'file',
      placeholder: 'more images',
      errorMessage:
        'Upload more images of the house',
      label: 'More House Images',
      required: true,
      multiple: true,
    },
  ];

  const [cover, otherImages] = inputs.slice(-2);
  // console.log({ cover }, { otherImages });

  const [postHouse, { isLoading }] = usePostHouseMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log({ values });
    const data = { ...values };
    delete data.location;
    const [city, state, country] = values.location.split(',');
    data.city = city;
    data.state = state.split(' ')[1];
    data.country = country.split(' ')[1];
    data.shared = data.shared === 'Yes'.toLowerCase();
    data.electricity = true;
    data.water = true;
    data.numToilets = 1;
    data.numBathrooms = Number(data.numBathrooms);
    data.numRooms = Number(data.numRooms);
    data.numFloors = Number(data.numFloors);
    data.price = Number(data.price.split('-')[0]);
    console.log(data, typeof (data.images));
    if (!isLoading) {
      try {
        const formData = new FormData();
        Object.keys(data).forEach((key) => formData.append(key, data[key]));
        formData.delete('images'); // incorrectly set
        data.images?.slice(0, 3).map((image) => formData.append('images', image)); // correctly set value
        // console.log(formData.get('numToilets'), formData.get('price'), formData.get('coverImage'), formData.get('images'));
        const res = await postHouse(formData).unwrap();
        console.log('post house res: ', res);
        if (res.success) {
          toast.success('House posted successfully');
          // navigate back to user listings
          navigate('/user');
        }
      } catch (error) {
        console.error('Failed to post house: ', error);
        toast.error('House posting failed, try again...');
      }
    }
  };

  const onChange = (e) => {
    if (e.target.name === 'coverImage') {
      console.log('coverImage: ', e.target.files[0]);
      setValues({ ...values, coverImage: e.target.files[0] });
    } else if (e.target.name === 'images') {
      console.log('images: ', Array.from(e.target.files));
      setValues({ ...values, images: Array.from(e.target.files) });
    } else {
      setValues({ ...values, [e.target.name]: e.target.value });
    }
  };

  if (isFetching) {
    return (
      <div className="w-full my-8 mx-2 md:mx-16 h-screen flex flex-col gap-2 items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-2">
          <span className="text-slate-600 font-semibold">Loading ...</span>
        </div>
      </div>
    );
  }
  if (error) {
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
          Post a house
        </h1>
        {inputs.slice(0, -2).map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={input.type !== 'file' ? values[input.name] : ''}
            // value={values[input.name]}
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
        {/* <input type="file" name="altImages" multiple onChange={onChange} /> */}
        <button
          type="submit"
          className="w-[280px] md:w-full mt-8 bg-green rounded-md text-white p-3
          transition-colors hover:bg-md_green"
        >Post House
        </button>
      </form>
    </div>
  );
};

export default CreateHouse;
