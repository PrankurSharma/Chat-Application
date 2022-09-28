import io from 'socket.io-client';
import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import Chat from './Chat';
import MyRooms from './MyRooms';

const socket = io.connect("http://localhost:3001");

function Main() {
    Axios.defaults.withCredentials = true;
    const [username, set_username] = useState("");
    const [email, set_email] = useState("");
    const [groupclick, set_groupclick] = useState(false);
    const [displayChat, set_displayChat] = useState(false);
    const [room, set_room] = useState("");

    useEffect(() => {
        Axios.get('http://localhost:3001/api/login').then((response) => {
            set_username(response.data[0].name);
            set_email(response.data[0].email);
        });
    }, []);

    function changeGroupClick(newValue){
        set_groupclick(newValue);
    }

    function setRoom(newValue){
        set_room(newValue);
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

    return (
        <div>
            <div>
                <h1> Hi User {username} </h1>
                <button onClick={() => {
                    window.location.href = '/createroom';
                }}> Create a Room </button>
                <button onClick={() => {
                    window.location.href = '/joinroom';
                }}> Join a Room </button>
            </div>
            <div className='main-body'>
                <div className='groups'>
                    <h1> My Groups </h1>
                    <MyRooms changeGroupClick={changeGroupClick} setRoom={setRoom} />
                </div>
                <div className='chats'>
                    {!displayChat ? 
                        (<></>) : 
                        (<>
                            <Chat socket={socket} username={username} room={room} groupclick={groupclick}/>
                        </>)
                    }
                </div>
            </div>
        </div>
    );
}

export default Main;