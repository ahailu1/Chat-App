import React, {useState} from 'react';
import { MessageFilled , DeleteFilled,LockFilled } from '@ant-design/icons';
import {Button, Avatar} from 'antd';
import styles from './chatbox.module.scss'
import io from 'socket.io-client';
import UserContext from '../../context';
import axios from 'axios';
import TextArea from 'antd/lib/input/TextArea';

class Chatbox extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            initMessage: false,
            toggled: false,
            msgHistory : [],
            friends : [],
            globalVar : "https://instachatter.com",
            mymsg : "",
        }
        this.getMessage = this.getMessage.bind(this);


    }
    componentDidMount = () => {
        this.getHistory();
         this.getMessage();
    }

    getFriends = async () => {
            const {username} = this.props.userData;
            const request = await axios.get(`${this.state.globalVar}/chat/friendslist/getfriends/${username}`);
            const data = request.data;
            }


    createProfile =  (username) => {
        //const request = await axios.get(`http://localhost:5000/chat/friendslist/getfriends/${username}`);
        //const data = await request.data;
        
        return (
            <>
            <div className = {styles.container__avatar}>
                <Avatar shape = 'circle' size = {125} src = {`${this.state.globalVar}/images/${username}--profilepicture.png`} className = {styles.avataraz}>U</Avatar>
            </div>
            <div className = {styles.container__username}>
            </div>
            </>
            )
    }



getMessage = () => {
const {username} = this.props.userData;
 this.props.socket.on(username, (data) => {
if(data.sender == this.props.friendName ) {
    this.setState( (prev) => {
        let newMsg = prev.messages.concat(data);
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

getHistory = () => {
    const { username } = this.props.userData;
    console.log(username + 'hello');
let response = axios.get(`${this.state.globalVar}/chat/chatbox/${username}/${this.props.friendName}`)
    .then((res) => {
        res.data.forEach((el) => {
        })
        this.setState({msgHistory:res.data})
    })
    .catch((err) => {
    })
}
messageHistory = (el, index) => {
    let newTime = el.timezone;
    newTime = new Date(el.timezone).toLocaleString();
    return (
        
        <div className = {`${styles.message__sent} ${el.sender == this.props.friendName && styles.toggled}`} key = {index} >
      <Avatar className = {styles.message__sent__avatar} src = {`${this.state.globalVar}/images/${el.sender}--profilepicture.png`}>U</Avatar>

        <div className = {styles.container__history__message}> 
        
        <div className = {styles.container__history__format}>  
                <div className = {styles.sender}> {el.sender} </div>
                <div className = {styles.time}> {newTime} </div>
        </div>
        <div>{el.message}</div>
       </div>
        </div>
            )
    
}
handleText = (e) => {
    let myval = e.target.value;
    console.log(myval);
    this.setState({mymsg: myval});
}

sendMessage = (e) => {
e.preventDefault();
const {username} = this.props.userData;
const friendname = this.props.friendName;
let message = e.target.message.value;
const {socket} = this.props;
let time = new Date().toLocaleString();
  
const data = {
    room: this.props.friendName,
    message: message,
    sender: username,
    recipient: friendname,
    time: time,
}
// call backend function
// insert messages into database
this.setState( (prev) => {
    return{
        messages: prev.messages.concat(data),
        mymsg: "",
    }
});

socket.emit('message', data);

}


render() {
let {msgHistory, mymsg} = this.state
let {username} = this.props.userData;
return(

    <div className = {`${styles.container__chatbox} ${this.props.toggled.includes(this.props.friendName) && styles.toggled}`} >

    <div className = {styles.container__sent}>

        <div className = {styles.container__chat}>
            <div className = {styles.container__wrapper0}>
        <div className = {styles.container__wrapper}>

        <div className = {styles.container__history}>
        { msgHistory.length > 0 && msgHistory.map((el,index) => {
            return this.messageHistory(el,index) 
            })
        }
        </div>
        
        <div className = {styles.sent}>
         {this.state.messages.length > 0 && this.state.messages.map ((el, index) => {
        return <div className = {`${styles.message__sent} ${el.sender == this.props.friendName && styles.toggled}`} key = {index} >
<Avatar className = {styles.message__sent__avatar} src = {`${this.state.globalVar}/images/${el.sender}--profilepicture.png`}>U</Avatar>
        
        <div className = {styles.container__history__message}>
            <div className = {styles.container__history__format}>  
                <div className = {styles.sender}> {el.sender} </div>
                <div className = {styles.time}> {el.time} </div>
            </div>
        <div>{el.message}</div>
       </div>
                </div>
    })
    }
     </div>
    </div>
    </div>
    <div className = {styles.container__form}>
    <form className = {styles.form} onSubmit = {this.sendMessage}>
    <div className = {styles.container__message}>
    <div className = {styles.container__input}>   <TextArea type = 'text' name = 'message' className = {styles.input} onChange = {this.handleText} value = {mymsg} />    </div>
    <div className = {styles.container__button}><Button type = 'default' htmlType = 'submit' className = {styles.button}>Send</Button></div>
        </div>
    </form>
    </div>

    </div>
    </div>
    <div className = {styles.container__profile}>
    { this.createProfile(this.props.friendName)}
    </div>
    </div>
)
}    

}

export default Chatbox;