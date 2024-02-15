import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Ensure the path is correct
import HomePageView from './components/pages/HomePageView/HomePageView';
import SignUp from './components/pages/SignUp';
import UserHome from './components/pages/UserHome';
import {Protected} from './components/Protected'; // Assuming Protected is correctly implemented
import EditProfile from './components/EditProfile';
import ExplorePage from './components/Explore';
import CreatePost from './components/CreatePost';
function App() {
  return (
    <>
     
      <Routes>
        <Route path='/' element={<HomePageView/>}/>
        <Route path='/home' element={<HomePageView/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/userhome' element={<Protected><UserHome/> <Navbar /></Protected>} />
        <Route path='/edit' element={<Protected><EditProfile/> <Navbar /></Protected>} />
        <Route path='/explore' element={<Protected><ExplorePage/> <Navbar /></Protected>} />
        <Route path='/create' element={<Protected><CreatePost/> <Navbar /></Protected>} />
      </Routes>
    </>
  );
}

export default App;