import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarSearch from '../../components/navbar/NavbarSearch';
import FriendBox from '../../components/friendBox/FriendBox';
import UserInfo from '../../components/userInfo/userInfo';
import RightBar from "../../components/rightBar/RightBar";

import "./profile.css";
import MessageList from "../../components/message/MessageList";
import { useParams } from 'react-router-dom';
import NotFound from '../../components/notFound/NotFound';

export default function Profile() {
    const [user, setUser] = useState(undefined);
    const username = useParams().username;

    useEffect(() => {
        async function fetchUser() {
            const res = await axios.get(`/users?username=${username}`, { withCredentials: true });
            setUser(res.data);
        }
        fetchUser();
    }, [username]);

    return (
        <div>
            <NavbarSearch />
            <div className="mainScreen">
                <FriendBox />
                {user !== undefined ?
                    <div className="main">
                        <UserInfo data={user} />
                        <hr />
                        <MessageList username={user.username} />
                    </div> :
                    <NotFound name={username} />}
                <RightBar />
            </div>
        </div>
    )


}