import {
  Card, CardBody, CardText, CardHeader
}
  from "reactstrap";
import { FcLike } from "react-icons/fc";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/user/UserContext";
import CommentList from "../comment/CommentList";
import CommentForm from "../comment/CommentForm";

export default function Message({ post }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [likes, setLikes] = useState(post.like.length)
  const [liked, setLiked] = useState(false);
  const [user, setUser] = useState({});
  const { user: currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    setLiked(post.like.includes(currentUser._id));
  }, [currentUser._id, post.like])

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?userId=${post.userId}`, { withCredentials: true });
      setUser(res.data);
    }
    fetchUser();
  }, [post.userId]);

  const likeHandler = () => {
    try {
      axios.put("/posts/" + post._id + "/like", { userId: currentUser._id }, { withCredentials: true });
    } catch (error) {
      console.log(error);
    }
    setLikes(liked ? likes - 1 : likes + 1);
    setLiked(!liked);
  }

  const deleteHandler = async () => {
    if (post.userId === currentUser._id || currentUser.isAdmin) {
      try {
        // delete all the comments of the post
        await axios.delete("/comments/all/" + post._id, {}, { withCredentials: true });
        // delete the post
        await axios.delete("/posts/" + post._id, {},{ withCredentials: true });
        // refresh the page
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
    setLiked(false);
  }

  return (
    <Card className="messageCard">
      <CardHeader className="messageCardHeader cursor-pointer">

        <Link to={`/profile/${user.username}`}>
          <img src={user.profilePhoto ? PF + user.profilePhoto : PF + "person/defaultAvatar.jpg"} alt="" className="messageProfileImg"
            crossOrigin="anonymous"
          />

        </Link>
        <span className="messageUsername">{user.username}</span>

      </CardHeader>
      <CardBody className="messageBody">
        <small className="timeSpan">{format(post.createdAt)}</small>
        <CardText className="messageText">
          {post.content}
        </CardText>

        {post.photo &&
          <img className="messageImg"
            alt="Card"
            src={PF + post.photo}
            crossOrigin="anonymous"
          />}
        <hr />
        <div className="messageFooter d-flex">
          <span className="postLike me-auto" onClick={likeHandler}>
            <FcLike className="cursor-pointer" /> {likes}
          </span>
          {currentUser._id === post.userId && <span className="cursor-pointer ml-auto" onClick={deleteHandler}>delete</span>}
        </div>
        <div className="mt-3">
          <CommentList postId={post._id}/>
          <CommentForm postId={post._id}/>
        </div>
      </CardBody>
    </Card>
  );
}