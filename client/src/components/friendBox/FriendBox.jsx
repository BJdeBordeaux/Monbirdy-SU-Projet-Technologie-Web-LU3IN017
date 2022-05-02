import { useContext } from "react";
import { UserContext } from "../../context/user/UserContext";
import FriendList from "./FriendList";
import "./friend.css";

export default function FriendBox() {

    const { showFriends } = useContext(UserContext);

    return (
        <div className="friendBox">
            {showFriends && <FriendList className="friendList overflow-auto h-100" />}
        </div>
    );
};