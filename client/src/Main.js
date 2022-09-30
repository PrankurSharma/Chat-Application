import io from 'socket.io-client';
import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import Chat from './Chat';
import MyRooms from './MyRooms';
import Header from './Header';
import Spinner from './Spinner';

const socket = io.connect("http://localhost:3001");

function Main() {
    Axios.defaults.withCredentials = true;
    const [username, set_username] = useState("");
    const [email, set_email] = useState("");
    const [groupclick, set_groupclick] = useState(false);
    const [displayChat, set_displayChat] = useState(false);
    const [room, set_room] = useState("");
    const [groupname, set_groupname] = useState("");
    const [loading, set_loading] = useState(true);

    function changeGroupClick(newValue) {
        set_groupclick(newValue);
    }

    function setGroup(newValue1, newValue2) {
        set_room(newValue1);
        set_groupname(newValue2);
    }

    function handleChange(newValue) {
        set_loading(newValue);
    }

    function fetchDetails(newValue1, newValue2) {
        set_username(newValue1);
        set_email(newValue2);
    }

    const joinRoom = () => {
        if(email !== "" && room !== ""){
            Axios.post('http://localhost:3001/api/checkroom', {
                email: email,
                room: room
            }).then((response) => {
                socket.emit("join_room", room);
                set_displayChat(true);
            });
        }
    };

    useEffect(() => {
        joinRoom();
    }, [groupclick]);

    if(loading) {
        return (
            <Spinner handleChange={handleChange} fetchDetails={fetchDetails} />
        );
    }

    return (
        <div>
            <div>
                <Header username={username} />
            </div>
            <div className='main-body'>
                <div className='groups'>
                    <h1> My Groups </h1>
                    <MyRooms changeGroupClick={changeGroupClick} setGroup={setGroup} />
                </div>
                <div className='chats'>
                    {!displayChat ? 
                        (<></>) : 
                        (<>
                            <Chat socket={socket} username={username} email={email} room={room} groupname={groupname} groupclick={groupclick}/>
                        </>)
                    }
                </div>
            </div>
        </div>
    );
}

export default Main;