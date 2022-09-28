import React, { useEffect, useState } from "react";
import Axios from 'axios';

function Chat({socket, username, room, groupclick}){
    const [currentMess, set_currentMess] = useState("");
    const [messageList, set_messageList] = useState([]);
    const [loadChat, set_loadChat] = useState([]);
    const sendMessage = async () => {
        if(currentMess !== ""){
            const messageData = {
                room: room,
                sender: username,
                message: currentMess,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            };
            await socket.emit("send_message", messageData);
            set_messageList((list) => [...list, messageData]);
        }
    }

    const insertInDB = () => {
        if(currentMess !== ""){
            Axios.post('http://localhost:3001/api/insert', {
                room_no: room,
                sender: username,
                message: currentMess,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            });
        }
    }

    const chatFromDB = () => {
        Axios.post('http://localhost:3001/api/getmessages', {
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
            <p> Live Chat </p>
        </div>
        <div className="chat-body">
            {loadChat.map((c) => {
                return (
                    <div className="load_message">
                        <div className="my_message"> 
                            <p> {c.msg} </p>
                        </div>
                        <div className="msgMeta">
                            <p> {c.msg_time} </p>
                            <p> {c.sender} </p>
                        </div>
                    </div>
                );
            })}
            {messageList.map((msg) => {
                return (
                   <div className="load_message" id={username === msg.sender ? "you" : "other"}>
                        <div>
                            <div className="my_message">
                                <p> {msg.message} </p>
                            </div>
                            <div className="msgMeta">
                                <p id="time"> {msg.time} </p>
                                <p id="sender"> {msg.sender} </p>
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
                event.key === "Enter" && sendMessage();
            }}
            />
            <button onClick={() => {
                sendMessage();
                insertInDB();
                set_currentMess("");
            }}>&#9658;</button>
        </div>
    </div>
    );
}
export default Chat;