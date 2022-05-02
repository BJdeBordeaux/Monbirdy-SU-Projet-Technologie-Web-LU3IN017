import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import Comment from "./Comment";
import { UserContext } from '../../context/user/UserContext';

export default function CommentList({ postId }) {
    const [comments, setComments] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        async function fetchComments() {
            const res = await axios.get("/comments/all/" + postId, {withCredentials: true}); // get all comments of a post
            setComments(
                res.data.sort((p1, p2) => {
                    return new Date(p1.createdAt) - new Date(p2.createdAt);
                })
            );
        }
        fetchComments();
    }, [postId]);

    let commentsNode = comments.map((comment, id) => {
        return <Comment key={comment._id} comment={comment} />;
    });
    return (
        <div className="comments ">
            {commentsNode}
        </div>
    );
}

