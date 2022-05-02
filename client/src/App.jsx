import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavbarSearch from './components/navbar/NavbarSearch';
import SignIn from './pages/signIn/SignIn';
import LogIn from "./pages/logIn/LogIn";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import { UserContext } from './context/user/UserContext';
import NotFound from './components/notFound/NotFound';

export default function App() {

    const { user } = useContext(UserContext);

    return (
        <Router>
            <Routes>
                <Route exact path="/" element={user
                    ? <Home userInfo={user} />
                    : <LogIn />}
                />
                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/login" element={user ? <Navigate replace to="/" /> : <LogIn />} />
                <Route path="/signin" element={user ? <Navigate replace to="/" /> : <SignIn />} />
                <Route path="*" element={<><NavbarSearch /><NotFound /></>} />
            </Routes>
        </Router>
    );

}