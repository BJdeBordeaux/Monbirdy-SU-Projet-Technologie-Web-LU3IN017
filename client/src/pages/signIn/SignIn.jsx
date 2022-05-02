import React, { useRef, useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {
    Button, Form, FormGroup, Label,
    Card, CardHeader, CardFooter,
} from "reactstrap";
import "./signIn.css";

import Background from '../../resources/bgImg.jpg';
import axios from "axios";
import { LogInApiCall } from "../../LogInApiCall";
import { UserContext } from "../../context/user/UserContext";
import { appendErrors, useForm } from "react-hook-form";

const bgStyle = {
    width: "100%",
    backgroundImage: `url(${Background})`
};

export default function SignIn() {

    const navigate = useNavigate();

    const { dispatch } = useContext(UserContext);

    const [error, setError] = useState(null);

    const { register, watch, handleSubmit, formState: { errors } } = useForm();

    const handleSignIn = async () => {
        if (watch("confirmPassword") !== watch("password")) {
            setError("Passwords do not match!");
            return;
        }
        const newUser = {
            username: watch("username"),
            email: watch("email"),
            password: watch("password"),
        }
        // try {
        await axios.post("/auth/register", newUser, { withCredentials: true })
            .then(res => {
                LogInApiCall({ ...newUser }, dispatch);
                navigate("/");
            })
            .catch(err => {
                setError(err.response.data);
            });


    }

    const username = useRef();
    const email = useRef();
    const password = useRef();
    const confirmPassword = useRef();


    return (
        <div className="signInRoot d-flex justify-content-center align-items-center" style={bgStyle}>
            <Card className="signInBox">
                <CardHeader className="signInHeader">
                    <h3>Sign In</h3>
                </CardHeader>
                <Form className="signInForm border border-2"
                    onSubmit={handleSubmit(handleSignIn)}
                >
                    <br />
                    <FormGroup className="signInFormGroup form-floating mb-3">
                        <input className='form-control' type='text'
                            name='username' placeholder='username' ref={username} minLength={3} maxLength={20} required
                            {...register("username", { required: true, minLength: 3, maxLength: 20 })}
                        />
                        <Label>Username</Label>

                    </FormGroup>
                    <FormGroup className="signInFormGroup form-floating mb-3">

                        <input className='form-control'
                            type='email'
                            name='email' placeholder='email'
                            {...register("email", { type: "email", required: true, pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ })}
                        />
                        <Label>Email</Label>
                    </FormGroup>
                    <FormGroup className="signInFormGroup form-floating mb-3">
                        <input className='form-control'
                            type='password'
                            name='password' placeholder='password' ref={password} minLength={4} required
                            {...register("password", { required: true, minLength: 4 })}
                        />
                        <Label>Password</Label>
                        <div class="form-text">At least 4 characters.</div>
                    </FormGroup>
                    <FormGroup className="signInFormGroup  form-floating mb-3">
                        <input className='form-control' type='password' name='confirmPassword' placeholder='retype your password' ref={confirmPassword} minLength={4} required
                            {...register("confirmPassword", { required: true, minLength: 4 })}
                        />
                        <Label>Confirm Password</Label>
                    </FormGroup>
                    {error && <FormGroup className="signInFormGroup signInError mb-3">
                        <span className="">{error}</span>
                    </FormGroup>}

                    <CardFooter className="signInFooter">
                        <FormGroup className="signInFooter d-flex align-items-stretch">
                            <Button className="submitButton bg-info" type="submit">
                                Sign In
                            </Button>
                        </FormGroup>
                        <div>Already have an account? &nbsp;<a href="login">Log In</a></div>
                    </CardFooter>
                </Form>

            </Card>

        </div>
    );
}