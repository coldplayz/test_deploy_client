import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { Link } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { logo } from '../assets';
import Button from './Button';
import MobileMenu from './MobileMenu';
// import { rootUrl } from '../constants';
import { useLogoutMutation, useDeleteUserMutation, useEditUserMutation, useGetLoggedInUserQuery } from '../redux/services/latentAPI';
import { setUser } from '../redux/features/userSlice';

const ProfileModal = ({ showProfile, loggedInUser }) => {
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editUser, { isEditing }] = useEditUserMutation();
  const [deleteUser, { isDeleting }] = useDeleteUserMutation();
  // const [userData, setUserData] = useState({
  //   name: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
  //   email: loggedInUser.email,
  // });
  const [email, setEmail] = useState('');
  const [name_, setName] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('edit', name, ' ', value);
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'name') {
      setName(value);
    }
  };

  const handleEdit = async () => {
    setEdit(!edit);
    if (edit) {
      // save changes
      const editedUser = {};
      if (email !== loggedInUser.email) editedUser.email = email;
      const [firstName, lastName] = name_.split(' ');
      if (firstName !== loggedInUser.firstName) editedUser.firstName = firstName;
      if (lastName !== loggedInUser.lastName) editedUser.lastName = lastName;
      // console.log({ editedUser });
      if (Object.keys(editedUser).length && !isEditing) {
        try {
          const res = await editUser(editedUser);
          console.log({ res });
          if (res.data.success) {
            alert('Profile successfully updated!')
          }
        } catch (error) {
          console.error('editing a user failed: ', error);
          alert('edit profile failed, try again...')
        }
      }
    }
  };

  const handleDelete = async () => {
    setShowConfirmation(false); // close modal
    if (!isDeleting) {
      try {
        const res = await deleteUser();
        // console.log({ res });
        if (res.data.success) {
          alert('account successfully deleted!');
          navigate('/');
        }
      } catch (error) {
        console.log('Delete user/account failed: ', error);
        alert('Deleting your account failed, try again...');
      }
    }
  };

  return (
    <div className={`absolute smooth-transition ${showProfile ? 'right-4' : '-right-full'} top-16 flex flex-col gap-2 bg-white p-4 py-6 rounded-md shadow-lg`}>
      <span className={`${loggedInUser.isAgent ? 'hidden' : 'block'} text-center rounded-sm transition-colors hover:text-md_green cursor-pointer bg-light_green py-2`}>
        Become an agent
      </span>
      <div className="grid grid-cols-3 gap-1 ">
        <span className="col-span-1">Name</span>
        {edit ? (
          <input
            type="text"
            name="name"
            placeholder="Full name"
            // value={userData.name}
            value={name_}
            onChange={handleChange}
            className="col-span-2 text-s_gray border border-light_green focus:outline-none pl-2 rounded-sm"
          />
        ) : (
          <span className="col-span-2 text-s_gray">{`${loggedInUser.firstName} ${loggedInUser.lastName}`}</span>)}
      </div>
      <div className="grid grid-cols-3 gap-1 ">
        <span className="col-span-1">Email</span>
        {edit ? (
          <input
            type="text"
            name="email"
            placeholder="Your Email"
            // value={userData.email}
            value={email}
            onChange={handleChange}
            className="col-span-2 text-s_gray border border-light_green focus:outline-none pl-2 rounded-sm"
          />
        ) : (
          <span className="col-span-2 text-s_gray">{loggedInUser.email}</span>)}
      </div>
      <div className="flex items-center justify-between">
        <span
          className="rounded-sm text-sm text-green bg-light_green p-1 px-2 cursor-pointer transition-colors
      hover:text-md_green"
          onClick={handleEdit}
        >{edit ? 'Save' : 'Edit'}
        </span>
        <span
          className="rounded-sm text-sm text-green bg-light_green p-1 px-2 cursor-pointer transition-colors
      hover:text-md_green"
          onClick={() => setShowConfirmation(true)}
        >Delete
        </span>
      </div>
      <div className={`flex flex-col py-2 smooth-transition ${showConfirmation ? 'h-full opacity-1' : 'h-0 opacity-0'}`}>
        <span>Are you sure you want to delete?</span>
        <div className="flex items-center justify-between">
          <span
            className="rounded-sm text-sm text-green bg-light_green p-1 px-2 cursor-pointer transition-colors
      hover:text-md_green"
            onClick={() => setShowConfirmation(false)}
          >Cancel
          </span>
          <span
            className="rounded-sm text-sm text-green bg-light_green p-1 px-2 cursor-pointer transition-colors
      hover:text-md_green"
            onClick={handleDelete}
          >Delete
          </span>
        </div>
      </div>
    </div>
  );
};

const LoggedInNavbarLinks = ({ active, loggedInUser, handleLogout }) => {
  const [showProfile, setShowProfile] = useState(false);
  // console.log({ active });
  return (
    <>
      <div className="hidden md:flex space-x-4 items-center">
        <Link to="/user" className={`${loggedInUser.listings ? 'inline-block' : 'hidden'} p-1 cursor-pointer capitalize border  transition-colors ${active === '/user' ? 'border-y-md_green' : 'border-transparent'} hover:border-y-light_green rounded`}>My Listings</Link>
        <Link to="/explore" className={`p-1 cursor-pointer capitalize border transition-colors ${active === '/explore' ? 'border-y-md_green' : 'border-transparent'} hover:border-y-light_green rounded`}>Explore</Link>
        <Link to="/user/cart" className={`p-1 cursor-pointer capitalize border transition-colors ${active === '/user/cart' ? 'border-y-md_green' : 'border-transparent'} hover:border-y-light_green rounded`}>Cart</Link>
      </div>
      <div
        className="hidden md:flex items-center space-x-2 mr-2 cursor-pointer"
      >
        <div
          onClick={() => setShowProfile(!showProfile)}
          className="flex group items-center space-x-2"
        >
          <span className="text-sm text-green text-uppercase bg-bg_color rounded-full p-2 group-hover:text-md_green ">{`${loggedInUser.firstName[0]}${loggedInUser.lastName[0]}`}</span>
          <span className="text-green group-hover:text-md_green">{`${loggedInUser.firstName} ${loggedInUser.lastName}`}</span>
        </div>

        <span className="text-green hover:text-md_green border-l px-2" onClick={handleLogout}>Logout</span>
      </div>
      <ProfileModal
        loggedInUser={loggedInUser}
        showProfile={showProfile}
      />

    </>
  );
};

const NavbarLinks = () => (
  <>
    <div className="hidden md:flex space-x-4 items-center">
      <span className="p-1 cursor-pointer capitalize hover:border-b border-green"><a href="#hero">home</a></span>
      <span className="p-1 cursor-pointer capitalize hover:border-b border-green"><a href="#services">services</a></span>
      <span className="p-1 cursor-pointer capitalize hover:border-b border-green"><a href="#contacts">contact us</a></span>
      <span className="p-1 cursor-pointer capitalize hover:border-b border-green"><a href="#explore">explore</a></span>
    </div>
    <div className="hidden md:flex items-center space-x-2">
      <Link to="/login">
        <Button name="Login" type="secondary" />
      </Link>
      <Link to="/signup">
        <Button name="Sign Up" />
      </Link>
    </div>
  </>

);

const Navbar = () => {
  const isAgent = useSelector((state) => state.user.isAgent);
  // const user = useSelector((state) => state.user.user);
  const { data: loggedInUser, isFetching, error } = useGetLoggedInUserQuery();
  const [logout, { isLoading }] = useLogoutMutation();
  const currentRoute = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // console.log(currentRoute.pathname);
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // const [isAgent, setIsAgent] = useState(false);

  // if (!isFetching && !error) {
  //   console.log('user from Navbar: ', { loggedInUser });
  // }
  if (error) console.log('getting user err: ', { error });

  const handleLogout = async () => {
    if (!isLoading) {
      try {
        const res = await logout();
        console.log('logout from navbar: ', { res });
        if (res.data.success) {
          // clear user
          dispatch(setUser({}));
          console.log('after logout: ', { loggedInUser }, ' and isAgent: ', isAgent);
          navigate('/'); // navigate back to landing
        }
      } catch (err) {
        console.error('logout from navbar failed: ', { err });
      }
    }
  };

  return (
    <div className="max-w-[1400px] w-full flex flex-row justify-between items-center bg-white py-2 px-4 fixed z-10">
      <Link to="/">
        <img src={logo} alt="logo" className="h-12" />
      </Link>
      { !error && loggedInUser && Object.keys(loggedInUser).length ? (<LoggedInNavbarLinks active={currentRoute.pathname} loggedInUser={loggedInUser} handleLogout={handleLogout} isAgent={isAgent} />) : (<NavbarLinks />) }
      {/* Humbugger */}

      <div className="flex md:hidden items-center">
        {
          menuOpen ? (
            <AiOutlineClose
              style={{ color: hovered ? 'black' : 'green', height: '20px', width: '20px' }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={() => setMenuOpen(false)}
            />
          ) : (
            <AiOutlineMenu
              style={{ color: hovered ? 'black' : 'green', height: '20px', width: '20px' }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              onClick={() => setMenuOpen(true)}
            />
          )
        }
      </div>

      {/* Mobile Menu */}

      <div className={`md:hidden absolute z-10 top-16 shadow-sm smooth-transition ${menuOpen ? 'left-0' : '-left-full'}`}>
        <MobileMenu user={loggedInUser} handleLogout={handleLogout} isAgent={isAgent} error={error} active={currentRoute.pathname} />
      </div>
    </div>
  );
};

export default Navbar;
