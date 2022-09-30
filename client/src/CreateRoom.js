import { useState } from 'react';
import Axios from 'axios';
import uuid from 'react-uuid';
import Header from './Header';
import Spinner from './Spinner';
import { useNavigate } from 'react-router-dom';

function CreateRoom() {
    Axios.defaults.withCredentials = true;
    const [username, set_username] = useState("");
    const [email, set_email] = useState("");
    const [groupname, set_groupname] = useState("");
    const alloted_room = uuid().slice(0, 7);
    const [room, set_room] = useState("");
    const [loading, set_loading] = useState(true);

    const navigate = useNavigate();
    const navigateToHome = () => {
        navigate('/');
    }

    function handleChange(newValue) {
        set_loading(newValue);
    }

    function fetchDetails(newValue1, newValue2) {
        set_username(newValue1);
        set_email(newValue2);
        set_room(alloted_room);
    }
    
    const joinRoom = () => {
        if(email !== "" && groupname !== ""){
            Axios.post("http://localhost:3001/api/createroom", {
                email: email,
                room: room,
                groupname: groupname
            }).then((response) => {
                if(response.data.message){
                    alert(response.data.message);
                }
                else{
                    alert("Room created successfully.");
                    navigateToHome();
                }
            });
        }
        else {
            alert("Please enter a name for the group.");
        }
    };

    if(loading) {
        return (
            <Spinner handleChange={handleChange} fetchDetails={fetchDetails} />
        );
    }

    return (
        <div className="Room">
            <Header username={username} />
            <div className='joinContainer'>
                <div className="room-code">
                    <h3> Create A Room </h3>
                    <p> Please share the code: {room} with others in order to join the Chat group. </p>
                    <input type="text" placeholder="Name of this group" onChange={(event) => {
                        set_groupname(event.target.value);
                    }} />
                    <button onClick={() => {
                        joinRoom();
                        }}> Create Room </button>
                </div>
            </div>
        </div>
    );
}

export default CreateRoom;