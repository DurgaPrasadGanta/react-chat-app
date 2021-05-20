import React,{useState,useEffect} from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import './Chat.css';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';


let socket;



const Chat = ({ location }) => {
    const [name, setName]=useState('');
    const [room, setRoom]=useState('');
    const [messages, setMessages]=useState([]);
    const [message, setMessage]=useState('');
    const ENDPOINT='https://chatapp-reactjs-dp.herokuapp.com/';
    const [users, setUsers] = useState('');
    
    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        socket=io(ENDPOINT, { transports : ['websocket'] });

        setName(name);
        setRoom(room);

        socket.emit('join',{name,room},()=>{

        });
        return ()=>{
            socket.emit('disconnect');

            socket.off();
        }
    },[ENDPOINT,location.search]);

    useEffect(()=>{
        socket.on('message',(message)=>{
            setMessages([...messages,message]);
        socket.on("roomData", ({ users }) => {
                setUsers(users);
              });
        });
    })


    const sendMessage=(event)=>{
        event.preventDefault();
        if(message){
            socket.emit('sendMessage',message, ()=>setMessage(''));
        }
    }

    console.log(message, messages);

    return(
        <div className="outerContainer">
            <div className="container">
            <TextContainer users={users}/>
                <InfoBar room={room}/>
                <Messages messages={messages} name ={name}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
                
            </div>
        </div>
    )
}

export default Chat;