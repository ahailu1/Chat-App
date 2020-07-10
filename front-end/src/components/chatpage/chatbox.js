import React, {useState} from 'react';
import { MessageFilled , DeleteFilled,LockFilled } from '@ant-design/icons';
import {Button} from 'antd';
import styles from './chatbox.module.scss'
import io from 'socket.io-client';

class Chatbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: []
        }
}
componentDidMount = () => {
    this.getMessage();

}


getMessage = () => {
    const {socket} = this.props;

    socket.on('test123', (data) => {
        this.setState((prev) => {
            let sent = prev.messages.concat(data.message);
            console.log(sent);
            return {
                messages: sent
            }
        })
    });
}

sendMessage = (e) => {
e.preventDefault();
let message = e.target.message.value;
const {socket} = this.props;
const data = {
    room: 'test123',
    message: message,
}
socket.emit('message', data);

}


render() {
return(
    <div className = {styles.container__chatbox}>
        <div>
    <form className = {styles.form} onSubmit = {this.sendMessage}>
    <div className = {styles.container__message}>
    <div className = {styles.container__input}>   <textarea type = 'text' name = 'message' className = {styles.input} />    </div>
        <div className = {styles.container__button}><Button type = 'default' htmlType = 'submit' className = {styles.button}>Send</Button>   </div>
        </div>
    </form>
    </div>
    <div></div>
    </div>
)
}    

}

export default Chatbox;