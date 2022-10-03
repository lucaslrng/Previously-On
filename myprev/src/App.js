import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import MyFriends from './Pages/MyFriends';
import Catalogue from './Pages/Catalogue';
import MySeriesList from './Pages/MySeries';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { useReducer } from 'react';
import Show from './Pages/Show';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/MyFriends' element={<MyFriends />} />
        <Route path='/MySeries' element={<MySeriesList />} />
        <Route path='/Catalogue' element={<Catalogue />} />
        <Route path='/show/:id' element={<Show />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
