import React, { useState } from "react";

export const Register = (props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(username + password + repeatPassword);
    }

    return (<>    
    <div className="auth-form-container">
        <h2>Register</h2>

        <form className="register-form" onSubmit={handleSubmit}>
            <label htmlFor="username">Username: </label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} type="username" placeholder="username" id="username" name="username"/>
            <label htmlFor="password">Password: </label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="***********" id="password" name="password"/>
            <label htmlFor="repeatPassword">Repeat Password: </label>
            <input value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} type="password" placeholder="***********" id="repeatPassword" name="repeatPassword"/>
            <button>Register</button>
        </form>
        <button className="link-btn" onClick={() => props.onFormSwitch("login")}>Already have an account? Click here to login.</button>
    </div>
    </>
    )
}