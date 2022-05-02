import React, { useContext, useEffect, useRef} from "react";
import { LogInApiCall } from '../../LogInApiCall';
import { UserContext } from '../../context/user/UserContext'
import {
    Button, Form, FormGroup,
    Card, CardHeader, CardFooter,
} from "reactstrap";
import "./logIn.css";

import Background from '../../resources/bgImg.jpg';
import {useForm} from "react-hook-form";
import axios from "axios";

var bgStyle = {
    width: "100%",
    backgroundImage: `url(${Background})`
};

export default function LogIn() {

    const username = useRef();
    const password = useRef();

    const { error, dispatch } = useContext(UserContext);

    const {register, handleSubmit, watch} = useForm();

    const logIn = async()=> {
        await LogInApiCall({
            username: watch("username"),
            password: watch("password"),
        }, dispatch);
    }

    return (
        <div className="logInRoot d-flex justify-content-center align-items-center" style={bgStyle}>
            <Card className="logInBox">
                <CardHeader className="logInHeader">
                    <h3>Log In</h3>
                </CardHeader>
                <Form className="logInForm border border-2 needs-validation" noValidate
                      onSubmit={handleSubmit(logIn)}
                >
                    <br />
                    <div className="logInFormGroup form-floating mb-3">
                        <input type="text" className="form-control" id="floatingInput" placeholder="username"
                               {...register("username", { required: true, minLength:3,  maxLength: 20 })}
                        />
                            <label htmlFor="floatingInput">Username/Email</label>
                    </div>
                    <div className="logInFormGroup form-floating mb-3">
                        <input className='form-control' type='password' id="password"
                               placeholder='password'
                               {...register("password", { required: true, minLength:4 })}
                        />
                        <label htmlFor="password">Password</label>
                    </div>
                    {error && <FormGroup className="logInFormGroup logInError mb-3">
                        <span className="">{error}</span>
                    </FormGroup>}
                    <CardFooter className="logInFooter">
                        <FormGroup className="logInFooter d-flex align-items-stretch">
                            <Button className="submitButton bg-success" type="submit" onClick={handleSubmit(logIn)}>Log In</Button>
                        </FormGroup>
                        <div>Don't have an account? &nbsp;<a href="signin">Sign In</a></div>
                        <div><a href="/">Forget your password?</a></div>
                    </CardFooter>
                </Form>

            </Card>
        </div>
    );
}