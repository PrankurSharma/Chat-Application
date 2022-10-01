import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading';
import Axios from 'axios';

function Spinner({ handleChange, fetchDetails }) {
    Axios.defaults.withCredentials = true;
    const navigate = useNavigate();
    const navigateToLogin = () => {
        navigate('/login');
    }
    useEffect(() => {
        Axios.get('https://my-chatly.herokuapp.com/api/login').then((response) => {
            if(response.data.message){
                navigateToLogin();
            }
            else{
                fetchDetails(response.data[0].name, response.data[0].email);
                handleChange(false);
            }
        });
    }, []);
    return (
        <div className='spinner'>
            <ReactLoading type='spin' color="rgba(138, 43, 226)" height={150} width={70} />
        </div>
    );
}

 export default Spinner;