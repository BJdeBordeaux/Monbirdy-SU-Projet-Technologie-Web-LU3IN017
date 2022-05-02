import React from 'react';
import NavbarSearch from '../../components/navbar/NavbarSearch';
import MessageBox from '../../components/message/MessageBox';
import FriendBox from '../../components/friendBox/FriendBox';
import UserInfo from '../../components/userInfo/userInfo';
import RightBar from "../../components/rightBar/RightBar";

import "./home.css";
export default function Home({ userInfo }) {

    return (
        <div>
            <NavbarSearch isConnected={true} />
            <div className="mainScreen" >
                <FriendBox/>
                <div className="main">
                    <UserInfo data={userInfo} />
                    <MessageBox data={userInfo} />
                </div>
                <RightBar />
            </div>
        </div>
    )



}