import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, FormGroup } from "reactstrap";
import { UserContext } from "../../context/user/UserContext";

export default function MessageForm() {

    const { user } = useContext(UserContext);
    const [inputContent, setInputContent] = useState("");
    const [file, setFile] = useState(undefined);
    const contentRef = useRef();
    const fileRef = useRef();

    // upload the post to database
    const handleSubmit = async (event) => {
        event.preventDefault();
        // limite empty message
        if (inputContent.length === 0 && file === undefined) {
            return;
        }

        const newPost = {
            // userId: user._id,
            content: contentRef.current.value,
        }

        if (file !== null && file !== undefined) {
            const formData = new FormData();
            const filename = parseInt(Date.now() / 10000000) + '-' + file.name;
            formData.append('file', file);
            formData.append('name', filename);
            newPost.photo = filename;
            try {
                // upload photo
                await axios.post('/upload', formData, { withCredentials: true });
            } catch (error) {
                console.log(error);
                return;
            }
        }

        try {
            await axios.post(`/posts/${user._id}`, newPost, { withCredentials: true });
        } catch (error) {
            console.log(error);
        }
        window.location.reload()
    }

    const handleUpload = (event) => {
        if (event.target.files[0] !== undefined) {
            setFile(event.target.files[0]);
        }
    }

    const handleChange = (event) => {
        event.preventDefault();
        setInputContent(event.target.value);
    }

    return (
        <div className="messageForm mt-5 mb-5" onSubmit={handleSubmit}>
            <FormGroup className="messageFormGroup"><input className='messageFormInput form-control' ref={contentRef} onChange={handleChange} name="content" type="textarea" placeholder="What's new?" style={{ border: "none" }} /></FormGroup>
            <hr />
            {file &&
                <div className="messageFormImageDiv">
                    <img src={URL.createObjectURL(file)} alt="Upload" className="messageFormPhoto" />
                    <button type="button" className="messageFormDeleteImg btn-close" aria-label="Close"
                        onClick={() => {
                            setFile(undefined);
                            fileRef.current.value = '';
                        }}
                    ></button>

                </div>}
            <FormGroup className="messageFormGroup d-flex align-items-center justify-content-end mt-2">
                <div className="buttonsRight d-flex justify-content-around">

                    <div className="me-2">
                        <label className="messageFormButton btn btn-info d-flex text-light" htmlFor="file">
                            Add a photo
                            <input id="file" type="file" name="file" accept="image/jpg,image/jpeg,image/png"
                                onChange={handleUpload}
                                style={{ display: "none" }}
                                ref={fileRef}
                            />
                        </label>
                    </div>
                    <div ><Button className="messageFormButton me-0" color="success" type="submit" onClick={handleSubmit}>Submit</Button></div>
                </div>
            </FormGroup>
        </div>
    );

}