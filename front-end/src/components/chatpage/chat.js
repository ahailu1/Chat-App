import React from 'react';
import {Row, Col, Form, Input, Button, Layout, Avatar, Upload} from 'antd';
import styles from './chat.module.scss';
import { UploadOutlined } from '@ant-design/icons';
import Profilepicture from './profilepicture';
import Friendslist from './friendslist';
import Chatbox from './chatbox';
import io from 'socket.io-client';

class Chat extends React.Component{
constructor(props){
    super(props);
    this.state = {
        initChat: []
    }
    this.createChat = this.createChat.bind(this);
}

createChat = (username) => {
    if(this.state.initChat.includes(username)){
        alert('chat already started');
    } else {
    this.setState((prev) => {
        return{
            initChat: prev.initChat.concat(username)
            }
    });
    }
}

render(){
    const socket = io('http://localhost:5000');
    const {Sider,Content} = Layout;

    return(
        <Layout className = {styles.container__layout}>
        <Sider width = {325}  className = {styles.sidebar}>
        <Profilepicture/>
        <Friendslist createChat = {this.createChat}/>
        </Sider>
        <Content>
        {this.state.initChat.length > 0 && this.state.initChat.map( (el, index) => {
            return <Chatbox socket = {socket}/>

        })}

        </Content>
        </Layout>
            )
    }
}

export default Chat