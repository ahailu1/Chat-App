import React, {useState} from 'react';
import { MessageFilled , DeleteFilled,LockFilled } from '@ant-design/icons';
import {Button} from 'antd';
import styles from './chatbox.module.scss'
import io from 'socket.io-client';
import UserContext from '../context';

class Chatbox extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            initMessage: false,
            toggled: false
        }
        this.getMessage = this.getMessage.bind(this);


    }
    componentDidMount = () => {
         this.getMessage();
    }

getMessage = () => {
const {username} = this.props.userData;
 this.props.socket.on(username, (data) => {
if(data.sender == this.props.friendName ) {
    this.setState( (prev) => {
        let newMsg = prev.messages.concat(data.message);
        return {
            messages: newMsg
        }
    })
}
});
if(this.props.initMessage != false){
    this.setState((prev) => {
        let myMsg = prev.messages.concat(this.props.initMessage);
        return {
            messages: myMsg
        }
    })
}

}


sendMessage = (e) => {
e.preventDefault();
const {username} = this.props.userData;
const friendname = this.props.friendName;
let message = e.target.message.value;
const {socket} = this.props;
const time = new Date().toLocaleString();
const data = {
    room: this.props.friendName,
    message: message,
    sender: username,
    recipient: friendname,
    time: time,
}
this.setState( (prev) => {
    return{
        messages: prev.messages.concat(message)
    }
});
socket.emit('message', data);

}


render() {

return(

    <div className = {`${styles.container__chatbox} ${this.props.toggled.includes(this.props.friendName) && styles.toggled}`} >
        <div>hello</div>
        <div className = {styles.container__sent}> 
        <div className = {styles.sent}> 
         {this.state.messages.length > 0 && this.state.messages.map ((el, index) => {
        return <div className = {`${styles.message__sent} ${index % 2 != 0 && styles.toggled}`} key = {index} >
       
        
            
            <div> <h1>{el}</h1></div>
        </div>
    })
    }
    </div>
    
    </div>


  <div className = {styles.container__form}>
    <form className = {styles.form} onSubmit = {this.sendMessage}>
    <div className = {styles.container__message}>
    <div className = {styles.container__input}>   <textarea type = 'text' name = 'message' className = {styles.input} />    </div>
    <div className = {styles.container__button}><Button type = 'default' htmlType = 'submit' className = {styles.button}>Send</Button></div>
        </div>
    </form>
    </div>
      
    </div>
)
}    

}

export default Chatbox;