import { useEffect, useState, useContext } from "react";
import Friend from "./Friend";
import { ListGroup} from "reactstrap";
import { UserContext } from "../../context/user/UserContext";
import axios from "axios";

export default function FriendList(){
    const [friends, setFriends] = useState([]);
    const {user} = useContext(UserContext);
    
    // get the list of friends
    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get(`/users/${user._id}/followings`, {withCredentials: true});
            setFriends(res.data);
        };
        fetchData();
    }, [user]);
    

    const friendNode = friends.map((friend, index) => {
        return <Friend key={friend._id} friend={friend}/>
    });
    return(

        <ListGroup className="friendList d-inline-flex"
            flush
        >
            {friendNode}
        </ListGroup>
    );
};