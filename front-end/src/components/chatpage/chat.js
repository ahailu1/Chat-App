import React from 'react';
import {Layout, Tabs, Avatar} from 'antd';
import styles from './chat.module.scss';
import { UploadOutlined, CloseSquareFilled } from '@ant-design/icons';
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
        users: [],
        initMessage: '',
        toggled: [],
        loggedIn: []
        }

    this.createChat = this.createChat.bind(this);
    this.removeTab = this.removeTab.bind(this);
}

componentDidMount = () => {
    this.createSocket();
}

createTab = (el) => {
    console.log('hello tabs');
    return (
        <div className = {styles.tab__container}>
            <span className = {styles.tab__icon}>
            <CloseSquareFilled className = {styles.tabicon} onClick = { () => { this.removeTab(el) }}/>
            </span>
            <span className = {styles.tab__name}>
            {el}
            </span>
            </div>
    )
}
createProfile = (username) => {
    console.log(username);
    return (
        <>
        <div className = {styles.container__avatar}>
            <Avatar shape = 'circle' size = {150} src = {`/images/${username}--profilepicture.png`} />
        </div>
        <div className = {styles.container__username}>
           {username}
        </div>
        </>
        )
}

removeTab = (name) => {

    this.setState((prev) => {
        console.log(prev.initChat);
        let newList = prev.initChat;
        newList = newList.filter((el) => {
            return el != name;
        });
        return {
            initChat: newList
        }


    })

}

createSocket = () => {
    const socket = io('http://localhost:5000');
    const cookie = new Cookies();
    const userData = cookie.get('userData');
    const {username} = userData;
    const data = {
        username,
        online: true,
    }
    socket.emit('login', data);
    
    setTimeout(() => {
    socket.emit('login', data);
        }, 5000);

    socket.on(username, (data) => {
        console.log('hello');
        console.log(data.sender);
        if (!this.state.initChat.includes(data.sender)) { 
            this.createChat(data.sender, data.message);
        } else {

        }

    });
    //send message that indicates you are logged in
    // once message is sent sent and received, 
    //receive message that indicates you are logged in
}

toggleUser = (friendname) => {
this.setState((prev) => {
    let newList = prev.filter((el) => {
    return el != friendname
    });
    return {
        initChat : newList
    }
})
}

createChat = (friendname, initialMessage = '') => {
    const cookie = new Cookies();
    const userData = cookie.get('userData');
    const {username} = userData;
    const userObject = {
        sender: username,
        recipient: friendname,
        messages: [],
        initialMessage:[],
    }

    if(this.state.initChat.includes(friendname)){
        
        this.setState( (prev) => { 
            let newList = prev.toggled.includes(friendname) ? prev.toggled.filter(el => el != friendname) : prev.toggled.concat(friendname);
            return {toggled: newList}
        });
    } else {
    this.setState((prev) => {
        const arr = [...prev.initChat];
        arr.push(userObject);
        return{
            users: arr,
            initChat: prev.initChat.concat(friendname),
            initMessage: initialMessage 
            }
        });
    }
}

render(){
    const cookie = new Cookies();
    const userData = cookie.get('userData');
    const {Sider,Content} = Layout;
    const socket = io('http://localhost:5000');
    const { TabPane } = Tabs;
    return(
        <Layout className = {styles.container__layout}>
        <Sider width = {450}  className = {styles.sidebar}>
        <Profilepicture userData = {userData}/>
        <Friendslist createChat = {this.createChat} userData = {userData} toggled = {this.state.toggled} socket = {socket}/>
        </Sider>
        <Content>
            
        <Tabs type = 'card' className = {styles.tab__card}>
        {
        this.state.initChat.length > 0 && this.state.initChat.map( (el, index) => {
           
            return <TabPane tab = {this.createTab(el) } key = {index}>
            <Chatbox socket = {socket} userData = {userData} createProfile = {this.createProfile} toggled = {this.state.toggled} friendName = {el} key = {index} initMessage = {this.state.initMessage != '' ? this.state.initMessage : false }/>
            </TabPane>
        })
        }
        </Tabs>
        </Content>
        </Layout>
            )
    }
}

export default Chat