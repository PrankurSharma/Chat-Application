import React, { useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
function Signup() {
    const [email, set_email] = useState("");
    const [username, set_username] = useState("");
    const [password, set_password] = useState("");
    const navigate = useNavigate();
    const navigateToLogin = () => {
        navigate('/login');
    }

    const handleSubmit = () => {
        if(email && username && password){
            Axios.post('https://my-chatly.herokuapp.com/api/signup', {
                email: email,
                username: username,
                password: password
            }).then((response) => {
                if(!response.data.message && !response.data.error){
                    navigateToLogin();
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

    return (
        <div className="login-form">
            <div>
                <h1> Signup </h1>
                <div className="content">
                    <div className="input-field">
                        <input type="text"
                        name="email"
                        onChange={(e) => {
                        set_email(e.target.value);
                        }} placeholder="Email" />
                    </div>
                    <div className="input-field">
                        <input type="text"
                        name="username"
                        onChange={(e) => {
                        set_username(e.target.value);
                        }} placeholder="Username" />
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
                    <button className='button1' onClick={navigateToLogin}> Already have an account? Login </button>
                    <button className='button1' onClick={() => {
                    handleSubmit();
                    }}> Register </button>
                </div>
            </div>
      </div>
    );
}
export default Signup;