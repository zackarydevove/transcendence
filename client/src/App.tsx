import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Friends from './pages/Friends';
import Chat from './pages/Chat';
import Play from './pages/Play';
import Leaderboard from './pages/Leaderboard';

const App = (): JSX.Element => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/profile' element={<Profile />}/>
        <Route path='/friends' element={<Friends />}/>
        <Route path='/chat' element={<Chat />}/>
        <Route path='/play' element={<Play />}/>
        <Route path='/leaderboard' element={<Leaderboard />}/>
      </Routes>
    </Router>
  );
}

export default App;
