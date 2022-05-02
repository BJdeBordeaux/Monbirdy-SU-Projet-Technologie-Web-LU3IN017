import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import Message from "./Message";
import { UserContext } from '../../context/user/UserContext';

export default function MessageList({ username }) {
    const [posts, setPosts] = useState([]);
    const { user } = useContext(UserContext);

    useEffect(() => {
        async function fetchPosts() {
            const res = username
                ? await axios.get("/posts/profile/" + username, {withCredentials: true}) // other people
                : await axios.get("/posts/timeline/" + user._id, {withCredentials: true}); // me
            setPosts(
                res.data.sort((p1, p2) => {
                    return new Date(p2.createdAt) - new Date(p1.createdAt);
                })
            );
        }
        fetchPosts();
    }, [username, user]);

    let messagesNode = posts.map((post, id) => {
        return <Message key={post._id} post={post} />;
    });
    return (
        <div className="messages container">
            {messagesNode}
        </div>
    );
}

