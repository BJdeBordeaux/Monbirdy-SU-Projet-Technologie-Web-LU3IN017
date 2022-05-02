import { Link } from 'react-router-dom';
import { ListGroupItem } from 'reactstrap'

export default function Friend({ friend }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    return (
        <ListGroupItem >
            <Link to={`/profile/${friend.username}`} className="friend cursor-pointer align-items-center d-inline-flex" style={{ textDecoration: "none" }} >
                <img src={friend.profilePhoto ? PF + friend.profilePhoto : PF + "person/defaultAvatar.jpg"} alt="" className="profileImg" crossOrigin="anonymous"
                />
                <span className="usernameSpan" style={{ textDecorationColor: "black", color: "black" }}>{friend.username}</span>
            </Link>
        </ListGroupItem>
    );
}