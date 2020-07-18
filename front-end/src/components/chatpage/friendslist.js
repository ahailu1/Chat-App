import React from 'react';
import {Row, Col, Form, Input, Button} from 'antd';
import { Tabs } from 'antd';
import { AppleOutlined, AndroidOutlined, MessageFilled , DeleteFilled,LockFilled, CheckCircleOutlined } from '@ant-design/icons';
import styles from './friendslist.module.scss';
import axios from 'axios';
import Friendrequests from './friendoptions/friendrequests';
import DisplayPending from './friendoptions/displayPending';
class Friendslist extends React.Component{
constructor(props){
    super(props);
    this.state = {
        friends: [],  
        notifications: [],
        value : '',
        pending: [],
    }
    this.deletePending = this.deletePending.bind(this);
}
componentDidMount = () => {
    this.getFriends();
    this.getPending();
    this.notifications();
}

handleChange = (e) => {
const value = e.target.value;
    this.setState({value: value});
}


getFriends = async () => {
console.log('got');
    const {username} = this.props.userData;
    console.log(username);
    const request = await axios.get(`http://localhost:5000/chat/friendslist/getfriends/${username}`);
    const data = request.data;
    console.log(data);
    this.setState({friends:data});
}



notifications = async () => {
    console.log('got');
        const {username} = this.props.userData;
        console.log(username);
        const request = await axios.get(`http://localhost:5000/chat/friendslist/notifications/${username}`);
        const data = request.data;
        console.log(data);
        this.setState({notifications:data});
    
    }

    deletePending = async (friendname) => {
        const {username} = this.props.userData;
        const request = await axios.get(`http://localhost:5000/chat/friendslist/deletepending/${username}/${friendname}`);
        
        await this.getPending();
    }
    getPending = async () => {
        console.log('got');
            const {username} = this.props.userData;
            console.log(username);
            const request = await axios.get(`http://localhost:5000/chat/friendslist/pending/${username}`);
            const data = request.data;
            console.log(data);
            this.setState({pending:data});
        }
    
        addFriend = async (e) => {
            const friendName = this.state.value;
            const {username} = this.props.userData;
            const request = await axios.get(`http://localhost:5000/chat/friendslist/addfriend/${username}/${friendName}`);

            console.log(friendName);
                    }


render(){
    const {TabPane} = Tabs;
    return(
        <Tabs defaultActiveKey = '2'>

            <TabPane key = "1" tab = 
            {
                <span className = {styles.tab}>
                   <AppleOutlined/> 
                   Friends
                </span>
            }
            onClick = {this.getFriends}
            >
            <div className = {styles.container__addfriend}>
            <input type = 'text' name = 'addfriend' className = {styles.input} value = {this.state.value} onChange = {this.handleChange} />
            <Button htmlType = 'submit' type = 'primary' className = {styles.button} onClick = {this.addFriend}>Add Friend </Button>
            </div>
                    {this.state.friends.length > 0  && this.state.friends.map((el, index) => {
                        return <Friendrequests friendname = {el} key = {index} createChat = { () => { this.props.createChat(el) }} displayIcon = {<LockFilled/> } />
                    })}
            </TabPane>
            <TabPane key = "2" tab = {
                <span className = {styles.tab}>
                   <AppleOutlined/> 
                   Requests
                </span>
                            }
                >
                            {this.state.notifications.map((el, index) => {
                                return <Friendrequests friendname = {el} key = {index} displayIcon = { <CheckCircleOutlined className = {styles.iconaz} />} createChat = {() => { this.props.createChat(el)}}/>
                            })}
            </TabPane>
            <TabPane key = "3" tab = {
                <span className = {styles.tab}>
                   <AppleOutlined/> 
                   Pending
                </span>
                            }
                            onClick = {this.getPending}
                >
                    {this.state.pending.map( (el, index) => {
                        return <Friendrequests friendname = {el} myFunc = { () => {this.deletePending(el) }} key = {index} createChat = {() => { this.props.createChat(el)}}/>;
                    })}
            </TabPane>
        </Tabs>
    )
}

}
export default Friendslist;