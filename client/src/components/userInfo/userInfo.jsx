import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../context/user/UserContext";
import { AiOutlineUserAdd, AiOutlineUserDelete, AiFillCamera, AiOutlineEdit, AiOutlineTeam, AiOutlineStar, AiOutlineEnvironment } from "react-icons/ai";
import { Form, FormGroup, Label } from "reactstrap";
import { useForm } from "react-hook-form";
import axios from 'axios';
import "./userInfo.css";

export default function UserInfo({ data }) {
    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user: currentUser, dispatch } = useContext(UserContext);
    const changeProfilePhotoRef = useRef(null);
    const changeCoverPhotoRef = useRef(null);
    const { handleSubmit, register, watch } = useForm()
    const [followed, setFollowed] = useState(currentUser.followings.includes(data._id));
    const [edit, setEdit] = useState(false);
    const relationshipTable = ["single", "in a relationship", "complecated"];

    const handleFollowing = async () => {
        await axios.put(`/users/${currentUser._id}/followings`,
            {
                userId: data._id,
            }
            , { withCredentials: true });
        if (followed) {
            dispatch({
                type: "AddFollowing",
                payload: data._id,
            });
        } else {
            dispatch({
                type: "RemoveFollowing",
                payload: data._id,
            });
        };
        setFollowed(!followed);
    };

    // change cover photo
    const handleChangeCoverPhoto = async (event) => {
        event.preventDefault();
        // check if update the profile photo
        if (changeCoverPhotoRef.current.files[0] === undefined || changeCoverPhotoRef.current.files[0] === null) {
            return;
        }
        // prepare the new profile photo
        const file = changeCoverPhotoRef.current.files[0];
        const formData = new FormData();
        const filename = parseInt(Date.now() / 10000000) + '-' + file.name;
        formData.append('file', file);
        formData.append('name', filename);
        try {
            // send the new cover photo to the server
            const uploadSuccess = await axios.post('/upload', formData, {
            }, { withCredentials: true });
            // if upload success, update the cover photo
            if (uploadSuccess.status === 200) {
                // update the user profile photo
                const res = await axios.put(`/users/${currentUser._id}`, {
                    userId: currentUser._id,
                    coverPhoto: filename,
                }, { withCredentials: true });
                // if update success, update the current cover photo
                if (res.status === 200) {
                    // update the profile photo
                    // // local version
                    data.coverPhoto = filename;
                }
                dispatch(
                    {
                        type: "ChangeCoverPhoto",
                        payload: filename
                    }
                )
                sessionStorage.setItem("user", JSON.stringify(currentUser));
            } else {
                console.log('upload failed');
                console.log(uploadSuccess);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // change profile photo
    const handleChangeProfilePhoto = async (event) => {
        event.preventDefault();
        // check if update the profile photo
        if (changeProfilePhotoRef.current.files[0] === undefined || changeProfilePhotoRef.current.files[0] === null) {
            return;
        }
        // prepare the new profile photo
        const file = changeProfilePhotoRef.current.files[0];
        const formData = new FormData();
        const filename = parseInt(Date.now() / 10000000) + '-' + file.name;
        formData.append('file', file);
        formData.append('name', filename);
        try {
            // send the new profile photo to the server
            const uploadSuccess = await axios.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${currentUser.token}`
                }
            }, { withCredentials: true });
            // if upload success, update the profile photo
            if (uploadSuccess.status === 200) {
                
                // update the user profile photo
                const res = await axios.put(`/users/${currentUser._id}`, {
                    userId: currentUser._id,
                    profilePhoto: filename
                }, { withCredentials: true });
                // if update success, update the current profile photo
                if (res.status === 200) {
                    // update the profile photo
                    data.profilePhoto = filename;
                    currentUser.profilePhoto = filename;
                    dispatch(
                        {
                            type: "ChangeProfilePhoto",
                            payload: filename
                        }
                    )
                    sessionStorage.setItem("user", JSON.stringify(currentUser));
                }
            } else {
                console.log('upload failed');
                console.log(uploadSuccess);
            }
        } catch (error) {
            console.log(error.response.data);
            console.log(error);
        }
    }

    // change other status
    const handleChangeUserInfo = async () => {
        // if the user is editing, update the user info
        if (edit) {
            try {
                // server side
                const res = await axios.put(`/users/${currentUser._id}`, {
                    userId: currentUser._id,
                    relationship: watch("relationship"),
                    description: watch("description"),
                    city: watch("city"),
                    field: watch("field"),
                }, { withCredentials: true });
                if (res.status === 200) {
                    // browser side
                    data.relationship = watch("relationship");
                    data.description = watch("description");
                    data.city = watch("city");
                    data.field = watch("field");
                    dispatch(
                        {
                            type: "ChangeUserInfo",
                            payload: {
                                relationship: watch("relationship"),
                                description: watch("description"),
                                city: watch("city"),
                                field: watch("field"),
                            }
                        }
                    )
                    sessionStorage.setItem("user", JSON.stringify(currentUser));
                    setEdit(false);
                }
                // window.location.reload();
            } catch (error) {
                console.log(error);
            }
        }
    }



    return (
        <div className="profileWrapper profileRightTop">
            <div className="profileCover">
                <img
                    className="profileCoverImg"
                    src={data.coverPhoto ? PF + data.coverPhoto : `${PF}post/defaultBackground.jpeg`}
                    alt=""
                    crossOrigin="anonymous"
                />
                <div className="coverOperation">

                    <div className="OperationItem">
                        {edit && <label className="messageFormButton btn btn-secondary d-flex text-light align-items-center justify-content-between"
                            htmlFor="changeCoverPhoto"
                        >
                            <AiFillCamera />Cover&nbsp;
                            <input id="changeCoverPhoto" type="file" name="file" accept="image/jpg,image/jpeg,image/png"
                                onChange={handleChangeCoverPhoto}
                                style={{ display: "none" }}
                                ref={changeCoverPhotoRef}
                            />
                        </label>}

                    </div>
                </div>
                <img
                    className="profileUserImg"
                    src={data.profilePhoto ? PF + data.profilePhoto : `${PF}person/defaultAvatar.jpg`}
                    alt=""
                    crossOrigin="anonymous"
                />
                <div className="profileUserOperation">
                    {currentUser.username === data.username ?
                        edit ?
                            <div className="OperationItem">
                                <label className="messageFormButton btn btn-secondary d-flex text-light align-items-center justify-content-between" htmlFor="changeProfilePhoto">
                                    <AiFillCamera />Profile&nbsp;
                                    <input id="changeProfilePhoto" type="file" name="file" accept="image/jpg,image/jpeg,image/png"
                                        onChange={handleChangeProfilePhoto}
                                        style={{ display: "none" }}
                                        ref={changeProfilePhotoRef}
                                    />
                                </label>
                            </div>
                            : <button className="messageFormButton btn btn-secondary d-flex text-light align-items-center justify-content-between"
                                onClick={() => setEdit(!edit)}
                            >
                                <AiOutlineEdit className="me-1" />Edit
                            </button>
                        :
                        <div className="profileUserOperationItem">
                            <button className="profileUserOperationItemButton  btn btn-secondary d-flex align-items-center"
                                onClick={handleFollowing}
                            >
                                {followed
                                    ? <><AiOutlineUserDelete />Unfollow</>
                                    : <><AiOutlineUserAdd />Follow</>}
                            </button>
                        </div>
                    }
                </div>
            </div>

            {edit ?
                <Form className="profileForm d-flex flex-column container" onSubmit={handleSubmit(handleChangeUserInfo)}>

                    <div className="changeProfileFormGroup form-floating">
                        <input className='form-control' type='text' id="description"
                            placeholder='description'
                            defaultValue={data.description}
                            {...register("description", { maxLength: 50 })}
                        />
                        <label htmlFor="description">description</label>
                    </div>
                    <div className="d-flex justify-content-between align-items-stretch">
                        <div className="changeProfileFormGroup form-floating m-auto">
                            <input className='form-control' type='text' id="city"
                                placeholder='city'
                                defaultValue={data.city}
                                {...register("city", { maxLength: 50 })}
                            />
                            <label htmlFor="city">city</label>
                        </div>
                        <div className="changeProfileFormGroup form-floating m-3">
                            <input className='form-control' type='text' id="field"
                                placeholder='field'
                                defaultValue={data.field}
                                {...register("field", { maxLength: 50 })}
                            />
                            <label htmlFor="field">field</label>
                        </div>
                        <select className="form-select m-auto selectRelationship"
                            defaultValue={data.relationship}
                            {...register("relationship")}
                        >
                            <option value={-1}>Hidden</option>
                            <option value={0}>{relationshipTable[0]}</option>
                            <option value={1}>{relationshipTable[1]}</option>
                            <option value={2}>{relationshipTable[2]}</option>
                        </select>
                    </div>
                    <div className="d-flex justify-content-end"><button className="form-control btn btn-primary" type="submit">Submit</button></div>
                </Form>



                : <div className="profileInfo d-flex justify-content-between">
                    <h4 className="">{data.username}</h4>
                    {data.description && <span className="userDetailInfo">{data.description}</span>}
                    <div className="d-flex">
                        {data.city && <span className="userDetailInfo me-4"><AiOutlineEnvironment color="#F7DC6F" className="me-2" />{data.city}</span>}
                        {data.field && <span className="userDetailInfo me-4"><AiOutlineStar color="#E74C3C" className="me-2" />{data.field}</span>}
                        {data?.relationship >= 0 && <span className="userDetailInfo me-4"><AiOutlineTeam color="#A569BD" className="me-2" />{relationshipTable[data.relationship]}</span>}
                    </div>
                </div>}
        </div>

    );
};