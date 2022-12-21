import React, { useEffect, useState } from "react";
import Axios from 'axios';
import { baseUrl } from "./baseUrl";

function Chat({socket, username, email, room, groupname, groupclick}){
    const [currentMess, set_currentMess] = useState("");
    const [messageList, set_messageList] = useState([]);
    const [loadChat, set_loadChat] = useState([]);
    const sendMessage = async () => {
        if(currentMess !== ""){
            const messageData = {
                room: room,
                sender: username,
                sender_email: email,
                message: currentMess,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            };
            await socket.emit("send_message", messageData);
            set_messageList((list) => [...list, messageData]);
            set_currentMess("");
        }
    }

    const insertInDB = () => {
        if(currentMess !== ""){
            Axios.post(baseUrl + '/api/insert', {
                room_no: room,
                sender: username,
                sender_email: email,
                message: currentMess,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            });
        }
    }

    const chatFromDB = () => {
        Axios.post(baseUrl + '/api/getmessages', {
            room_no: room
        }).then((response) => {
            set_loadChat(response.data);
        });
    }

    useEffect(() => {
        chatFromDB();
    }, [groupclick]);

    useEffect(() => {
        socket.on("receive_message", (data) => {
            set_messageList((list) => [...list, data]);
        });
    }, [socket]);
    
    return (
    <div className="chat">
        <div className="chat-head">
            <button onClick={() => {
                window.location.reload();
            }}>&#8592;</button>
            <h1> {groupname} </h1>
            <h5> Room Code: {room} </h5>
        </div>
        <div className="chat-body">
            {loadChat.map((c) => {
                return (
                    <div className="load_message" id={email === c.sender_email ? "you" : "other"}>
                        <div className="my_message">
                            <div> <p> {c.msg} </p> </div>
                            <div className="msgMeta">
                                <h6> {c.msg_time} </h6>
                                {email === c.sender_email ? <h6> You </h6> : <h6> {c.sender} </h6>}
                            </div>
                        </div>
                    </div>
                );
            })}
            {messageList.map((msg) => {
                return (
                   <div className="load_message" id={email === msg.sender_email ? "you" : "other"}>
                        <div className="my_message">
                            <div> <p> {msg.message} </p> </div>
                            <div className="msgMeta">
                                <h6 id="time"> {msg.time} </h6>
                                {email === msg.sender_email ? <h6> You </h6> : <h6> {msg.sender} </h6>}
                            </div>
                        </div>
                   </div> 
                ); 
            })}
        </div>
        <div className="chat-foot">
            <input type="text"
            value={currentMess} 
            placeholder="Message"
            onChange={(event) => {
                set_currentMess(event.target.value);
            }}
            onKeyPress={(event) => {
                event.key === "Enter" && sendMessage() && insertInDB();
            }}
            />
            <button onClick={() => {
                sendMessage();
                insertInDB();
            }}>&#9658;</button>
        </div>
    </div>
    );
}
export default Chat;