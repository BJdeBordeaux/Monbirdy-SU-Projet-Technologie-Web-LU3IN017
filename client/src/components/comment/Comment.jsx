import {
  Card, CardBody, CardText, CardHeader
}
  from "reactstrap";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/user/UserContext";
import './comment.css';

export default function Comment({ comment }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const { user: currentUser } = useContext(UserContext);

  // axios comment and user information
  useEffect(() => {
    const axiosUser = async () => {
      await axios
        .get(`/users?userId=${comment.userId}`)
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    };
    axiosUser();
  }, [comment.userId]);

  const deleteHandler = async () => {
    if (comment.userId === currentUser._id || currentUser.isAdmin) {
      try {
        await axios.delete("/comments/" + comment._id, {}, { withCredentials: true });
        // refresh the page
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <Card className="commentCard">
      <CardHeader className="commentCardHeader d-flex justify-content-between align-items-baseline">
        <div className="d-flex justify-content-around align-items-center">
          <Link to={`/profile/${user.username}`}>
            <img src={user.profilePhoto ? PF + user.profilePhoto : PF + "person/defaultAvatar.jpg"} alt="" 
            className="commentProfileImg me-2"
              crossOrigin="anonymous"
            />
          </Link>
          <span className="commentUsername me-2">{user.username}</span><small className="timeSpan">{format(comment.createdAt)}</small>
        <div className="d-flex  flex-wrap">
          <CardText className="commentText">
            {comment.content}
          </CardText>
        </div>
        </div>
        <div className="commentFooter d-flex ms-2">
          {currentUser._id === comment.userId && <span className="cursor-pointer ml-auto" onClick={deleteHandler}>delete</span>}
        </div>
      </CardHeader>
    </Card>
  );
}