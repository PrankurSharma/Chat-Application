import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from './baseUrl';

function Login() {
    Axios.defaults.withCredentials = true;
    const [email, set_email] = useState("");
    const [password, set_password] = useState("");
    const [loggedin, set_loggedin] = useState(false);
    const navigate = useNavigate();
    const navigateToSignup = () => {
        navigate('/signup');
    }
    const navigateToHome = () => {
        navigate('/');
    }

    useEffect(() => {
        Axios.get(baseUrl + '/api/login').then((response) => {
            if(response.data[0].name && response.data[0].email){
                set_loggedin(true);
            }
        })
    }, [loggedin]);

    const handleSubmit = () => {
        if(email && password){
            Axios.post(baseUrl + '/api/login', {
                email: email,
                password: password
            }).then((response) => {
                if(!response.data.message){
                    navigateToHome();
                }
                else{
                    alert(response.data.message);
                }
            });
        }
        else{
            alert("Please fill all the fields");
        }
    }

    if(loggedin) {
        return (
            <div className="warn">
                <h1> You are already signed in from an account. Please logout of that session in order to continue logging in to another account. Please navigate to: https://mychatly.netlify.app to access your account. </h1>
            </div>
        );
    }

    return (
        <div className="login-form">
            <div>
                <h1>Login</h1>
                <div className="content">
                    <div className="input-field">
                        <input type="text"
                        name="email"
                        onChange={(e) => {
                        set_email(e.target.value);
                        }} placeholder="Email" />
                    </div>
                    <div className="input-field">
                        <input type="password"
                        name="password"
                        onChange={(e) => {
                        set_password(e.target.value);
                        }} placeholder="Password" />
                    </div>
                </div>
                <div className="action">
                    <button className='button1' onClick={navigateToSignup}> Register an account </button>
                    <button className='button1' onClick={() => {
                    handleSubmit();
                    }}> Sign in </button>
                </div>
            </div>
      </div>
    );
}
export default Login;