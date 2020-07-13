import React from 'react';
import {Row, Col, Form, Input, Button, Layout, Avatar, Upload} from 'antd';
import styles from './chat.module.scss';
import { UploadOutlined } from '@ant-design/icons';
import Profilepicture from './profilepicture';
import Friendslist from './friendslist';
import Chatbox from './chatbox';
import io from 'socket.io-client';
import Cookies from 'universal-cookie';
import Objectaz from '../context';
class Chat extends React.Component{

    constructor(props){

    super(props);
    this.state = {
        initChat: [],
        users: []
        }

    this.createChat = this.createChat.bind(this);
}

componentDidMount = () => {
    console.log('sadasddsasda');
    this.createSocket();
}
// if the recipient of create chat is the same as my username

createSocket = () => {
    const socket = io('http://localhost:5000');
    const cookie = new Cookies();
    const userData = cookie.get('userData');
    const {username} = userData
    socket.on(username, (data) => {
        console.log('hello');
        console.log(data.sender);
        if(!this.state.initChat.includes(data.sender)){
            
            this.createChat(data.sender)
        } else {
            console.log('nope');
        }

    });
}


createChat = (friendname) => {
    const cookie = new Cookies();
    const userData = cookie.get('userData');
    const {username} = userData;
    const userObject = {
        sender: username,
        recipient: friendname,
        messages: [],
    }

    if(this.state.initChat.includes(friendname)){
        alert('chat already started');
    } else {
    this.setState((prev) => {
        const arr = [...prev.initChat];
        arr.push(userObject);
        return{
            users: arr,
            initChat: prev.initChat.concat(friendname)
            }
        });
    }
}

render(){
    const cookie = new Cookies();
    const userData = cookie.get('userData');
    const {Sider,Content} = Layout;
    const socket = io('http://localhost:5000');
    return(
        <Layout className = {styles.container__layout}>
        <Sider width = {325}  className = {styles.sidebar}>
        <Profilepicture userData = {userData}/>
        <Friendslist createChat = {this.createChat} userData = {userData}/>
        </Sider>
        <Content>
            
        {
        this.state.initChat.length > 0 && this.state.initChat.map( (el, index) => {
            return <Chatbox socket = {socket} userData = {userData} friendName = {el} key = {index} createChat = {this.createChat}/>

        })
        }

        </Content>
        </Layout>
            )
    }
}

export default Chat