import { Route, Routes } from 'react-router-dom';
import { useJsApiLoader } from '@react-google-maps/api';

import { House, Landing, Explore, AgentHome, Profile, Login, SignUp, CreateHouse, EditHouse, Cart } from './pages';
import Navbar from './components/Navbar';

const App = () => {
  // load the google script into the application
  const { isLoaded } = useJsApiLoader({
    // googleMapsApiKey: process.env.VITE_APP_GOOGLE_MAPS_API_KEY,
    googleMapsApiKey: import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'], // specify places API for autocompletion
  });

  // console.log({ isLoaded });

  return (
    <div className="relative flex flex-col">
        <Navbar />
        <div className="flex mt-16">
            <Routes>
                <Route path="/" element={<Landing isLoaded={isLoaded} />} />
                <Route path="/explore" element={<Explore isLoaded={isLoaded} />} />
                <Route path="/houses/:houseId" element={<House />} />
                <Route path="edit/:houseId" element={<EditHouse />} />
                <Route path="/user" element={<AgentHome />} />
                <Route path="/user/cart" element={<Cart />} />
                <Route path="/user/:id" element={<Profile />} />
                <Route path="/login" element={<Login reset={false} />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/houses/new" element={<CreateHouse />} />
                <Route path="/password-reset-form" element={<Login reset={true} />} />
            </Routes>
        </div>

    </div>
  );
};

export default App;
