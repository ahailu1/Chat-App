import React from 'react';
import {Row, Col, Form, Input, Button, Tabs, Avatar, Badge} from 'antd';
import { AppleOutlined, AndroidOutlined, MessageFilled , DeleteFilled,LockFilled, CheckCircleOutlined, UserOutlined } from '@ant-design/icons';
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
        loggedIn: []
    }
    this.deletePending = this.deletePending.bind(this);
}
componentDidMount = () => {
    this.getFriends();
    this.getPending();
    this.notifications();
    this.getOnline();
}

handleChange = (e) => {
const value = e.target.value;
    this.setState({value: value});
}
getOnline = () => {
    let {username} = this.props.userData;
    let socket = this.props.socket;
    let data = {
        username: username,
        online: true
    }

    socket.emit('login', data);
    //send data upon login
    //
    socket.on('login', (cb) => {
        cb.name = 'hello';
    let {username} = cb;
    //if user is logged in already, send a message to login
    //if i am logged in already and i receive a message
    if (this.state.loggedIn.indexOf(username) == -1) {
        console.log('iamherebud');
console.log(this.state.loggedIn);
    this.setState((prev) => {
       let islogged = this.state.loggedIn.concat(username);
        return { 
           loggedIn: islogged
       }
    });
    socket.on('disconnect', () => {
        let logout = {
            offline: true,
            username: username
        }
        socket.emit('logout', logout);
    });
    console.log(this.state.loggedIn)
}
console.log(this.state.loggedIn);

socket.on('logout', data => {
    console.log(data + 'is here');
   let newList =  this.state.loggedIn.filter( (el) => { return el !== data.username });
   this.setState({loggedIn: newList});
   console.log(newList);   
});
});
}

getDiv = (props) => {
    console.log(props)
    return ( <div>
        hello world
    </div>
    )
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
    confirmFriend = (friendName) => {
        const {username} = this.props.userData;
        axios.get(`http://localhost:5000/chat/friendslist/confirm/${username}/${friendName}`).then(data => {
            this.setState((prev) =>{
                const notifications = prev.notifications.filter((el) => {
                    return el != friendName 
                });
                const friends = prev.friends.concat(friendName);
                    return {
                        notifications: notifications,
                        friends: friends
                    }
                })
        }).catch(er => {
            alert('friend not added');
        });
       
    }

        addFriend = async (e) => {
            const friendName = this.state.value;
            const {username} = this.props.userData;
            this.setState((prev) => {
                if(prev.notifications.includes(friendName)) {
                    alert('name taken')
                } else if (this.state.pending.includes(friendName)){
                    alert('name is pending')
                } else if(prev.friends.includes(friendName)) {
                    alert('name already added');
                } else {
                    axios.get(`http://localhost:5000/chat/friendslist/addfriend/${username}/${friendName}`);
                    return {
                        value: '',
                        pending: prev.pending.concat(friendName),
                    }
                }
            })
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
            <Button htmlType = 'submit' type = 'primary' className = {styles.button} onClick = {this.addFriend} disabled = {this.state.value == '' ? true : false}>Add Friend </Button>
            </div>
                    {this.state.friends.length > 0  && this.state.friends.map((el, index) => {
                        return <Friendrequests userData = {this.props.userData} friendname = {el.friendname} loggedIn = {this.state.loggedIn} key = {index} createChat = { () => { this.props.createChat(el.friendname) }} displayIcon = {<LockFilled/> } toggled = {this.props.toggled} avatar = {() => {
                                return  <Avatar shape = 'circle' size = 'large' src = {`/images/${el.picture}`} className = {styles.container__avatar} className = {`${styles.avatar}`} />
                                       
                        }} />
                    })}
            </TabPane>
            <TabPane key = "2" tab = {
                <span className = {styles.tab}>
                   <AppleOutlined/> 
                   Requests
                </span>
                            }
                >
                    <getDiv>
                        helloasdas
                    </getDiv>
                            {this.state.notifications.map((el, index) => {
                                return <Friendrequests myFunc = {() => {this.confirmFriend(el)}} friendname = {el} key = {index} displayIcon = { <CheckCircleOutlined className = {styles.iconaz} />} avatar = {false} createChat = {() => { this.props.createChat(el)}}/>
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
                        return <Friendrequests friendname = {el} myFunc = { () => {this.deletePending(el) }} key = {index} createChat = {() => { this.props.createChat(el)}} avatar = {false}/>;
                    })}
            </TabPane>
        </Tabs>
    )
}

}
export default Friendslist;