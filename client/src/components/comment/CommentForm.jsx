import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, FormGroup } from "reactstrap";
import { UserContext } from "../../context/user/UserContext";

export default function CommentForm({ postId }) {

    const { user } = useContext(UserContext);
    const [inputContent, setInputContent] = useState("");
    const contentRef = useRef();

    // upload the comment to database
    const handleSubmit = async (event) => {
        event.preventDefault();
        // limite empty comment
        if (inputContent.length === 0) {
            return;
        }

        const newComment = {
            userId: user._id,
            content: contentRef.current.value,
            postId: postId,
        }

        try {
            await axios.post("/comments/", newComment, { withCredentials: true });
        } catch (error) {
            console.log(error.response.data);
        }
        window.location.reload()
    }

    const handleChange = (event) => {
        event.preventDefault();
        setInputContent(event.target.value);
    }

    return (
        <div className="commentForm d-flex " onSubmit={handleSubmit}>
            <input className='commentFormInput form-control' ref={contentRef} onChange={handleChange} name="content" type="textarea" placeholder="How do you like it?" style={{ border: "none" }} />
            <Button className="commentFormButton me-0" color="success" type="submit" onClick={handleSubmit}>Submit</Button>
        </div>
    );

}