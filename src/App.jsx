
import React from 'react'
import './App.css'
import './//components/pages/HomePageView/HomePageView'
import HomePageView from './//components/pages/HomePageView/HomePageView'
import { Routes,Route } from 'react-router-dom'
import SignUp from './components/pages/SignUp'
import UserHome from './components/pages/UserHome'
import { Protected } from './components/Protected'

function App() {
 

  return (
    <>
    <Routes>
      <Route path='/' element ={<HomePageView/>}/>
      <Route path='/home' element ={<HomePageView/>}/>
      <Route path='/signup' element ={<SignUp/>}/>
      <Route path='/userhome'  element ={<Protected><UserHome/></Protected>}  />
    </Routes>
   

    </>
  )
}

export default App
