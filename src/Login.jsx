import React, { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "./context/AuthProvider";

import axios from "./api/axios";
const LOGIN_URL = "/login";

export const Login = (props) => {
    const {setAuth} = useContext(AuthContext);

    const userRef = useRef();
    const errRef = useRef();
    const [errMsg, setErrMsg] = useState("");
    const [success, setSuccess] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(LOGIN_URL, {},
                {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                        "Content-Type": "application/json"
                    },
                    auth: {
                        username: username,
                        password: password
                    },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response));
            const accessToken = response.data.access_token;
            setAuth({username: username, password: password, accessToken});
        setSuccess(true);
        setUsername("");
        setPassword("");
        } catch (err) {
            console.log(JSON.stringify(err));
             if (!err?.response?.status === false) {
                setErrMsg("Incorrect username or password.");
            }
            if(!err?.response) {
                setErrMsg("No response from server");
            }

        }
    }
    
    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg("");
    }, [username, password])
 
    return (
        <>
        {success ? (
            <div className="auth-form-container">
                <strong>Success!</strong> You have successfully logged in.
            </div>
        ) : (
    <div className="auth-form-container">
        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
            
            <label htmlFor="username">Username: </label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} type="username" placeholder="username" id="username" name="username" autoComplete="off" ref={userRef} required/>
            <label htmlFor="password">Password: </label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="***********" id="password" name="password" />
            <button>Log In</button>
        </form>
    <button className="link-btn" onClick={() => props.onFormSwitch("register")}>Don't have an account? Click here to register.</button>
    </div>
        )}
    </>
    )
}