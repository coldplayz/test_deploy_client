import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import { toast } from 'react-toastify';
import { useRegisterUserMutation, useGetLoggedInUserQuery } from '../redux/services/latentAPI';
import { setUser } from '../redux/features/userSlice';

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userType, setUserType] = useState(null);
  const [values, setValues] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const inputs = [
    {
      id: 1,
      name: 'fullName',
      type: 'text',
      placeholder: 'Full name',
      errorMessage:
        "Full name should be 3-16 characters and shouldn't include any special character!",
      label: 'Full Name',
      // pattern: '^[A-Za-z0-9]{3,30}$',
      required: true,
    },
    {
      id: 2,
      name: 'email',
      type: 'email',
      placeholder: 'Email',
      errorMessage: 'It should be a valid email address!',
      label: 'Email',
      required: true,
    },
    {
      id: 3,
      name: 'phone',
      type: 'number',
      placeholder: 'Phone number',
      label: 'Phone Number',
    },
    {
      id: 4,
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      errorMessage:
        'Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!',
      label: 'Password',
      pattern: '^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$',
      required: true,
    },
    {
      id: 5,
      name: 'confirmPassword',
      type: 'password',
      placeholder: 'Confirm Password',
      errorMessage: "Passwords don't match!",
      label: 'Confirm Password',
      pattern: values.password,
      required: true,
    },
  ];
  const [registerUser, { isLoading }] = useRegisterUserMutation();
  const { data: userData, isFetching, usrErr } = useGetLoggedInUserQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log({ values });
    // console.log({ userType });
    const data = { ...values };
    delete data.fullName;
    delete data.confirmPassword;
    const [firstName, lastName] = values.fullName.split(' ');
    data.firstName = firstName;
    data.lastName = lastName;
    data.isAgent = userType === 'agent' ? 'true' : 'false';
    // console.log({ data });
    if (!isLoading) {
      try {
        const res = await registerUser(data).unwrap();
        // console.log(res);
        if (res.success) {
          toast.success('Successfully registered, welcome!');
          // set user to loggedIn user's details
          if (!usrErr && !isFetching) {
            dispatch(setUser(userData));
            console.log(userData);
            if (userData?.isAgent) {
              navigate('/user');
            } else {
              navigate('/explore');
            }
          }
          navigate('/explore'); // assume normal user
        }
        Object.keys(values).forEach((key) => setValues({ ...values, [key]: '' }));
      } catch (error) {
        // console.error('Failed to register user: ', error);
        toast.error('Signup failed, try again...');
      }
    }
  };

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex w-full my-8">
      <form
        onSubmit={handleSubmit}
        className="flex-1 flex flex-col px-4 md:px-16 items-center md:items-start"
      >
        <h1 className="flex self-start pl-8 md:pl-0 gap-1 items-center py-4 text-md font-semibold text-slate-600">
          Sign up as
          <select
            className="p-2 text-sm rounded focus:outline-none"
            onChange={(e) => setUserType(e.target.value)}
          >
            <option value="">choose one</option>
            <option value="agent">agent/landlord</option>
            <option value="user">user</option>
          </select>
        </h1>
        {inputs.map((input) => (
          <FormInput
            key={input.id}
            {...input}
            value={values[input.name]}
            onChange={onChange}
          />
        ))}
        <button
          type="submit"
          className="w-[280px] md:w-full mt-8 bg-green rounded-md text-white p-3
          transition-colors hover:bg-md_green"
        >Sign up
        </button>
      </form>
      <div className="hidden flex-1 md:flex h-full bg-form-bg bg-blend-multiply bg-cover
        bg-center overflow-hidden rounded-b-md"
      >
        <div className="flex flex-col w-full bg-gradient-to-b from-bg_color via-bg_color to-bg-transparent
          rounded-b-md overflow-hidden p-8"
        >
          <span className="text-xl font-bold text-green">
            Find your next house quickly, cheaply and conveniently with
            <span className="text-black pl-1">Latent</span>
          </span>
          <span className="text-sm text-green pt-4">Explore options from thousands of listed houses, all at the comfort of your home.</span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
