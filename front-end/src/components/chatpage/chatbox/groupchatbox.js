import React from 'react';
import styles from './groupchatbox.module.scss';
import {Input, Button,Spin, Avatar} from 'antd';
import {TeamOutlined} from '@ant-design/icons'
import io from 'socket.io-client';
import axios from 'axios';
class Groupchatbox extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            myMessages: [],
            groupMembers : [],
            groupInfo : {},
            loadingFriends: true,
            groupProfile: '',
            msgHistory: [],
            loadHistory : true,
            historyMsg: '',
        }
        this.msgBox = this.msgBox.bind(this);
    }
    componentDidMount = () => {
        this.getMessage();
        this.getGroupInfo();
        this.checkGroupProfile();
        this.getMsgHistory();
    }

    getMsgHistory = () => {
        let {groupId} = this.props;
        axios.get(`http://localhost:5000/chat/groups/chathistory/${groupId}`).then(el => {
        let msgHistory = el.data.msgHistory;
        console.log(msgHistory);
        this.setState({msgHistory: msgHistory, loadHistory: false});
        }).catch((el) => {
            this.setState({loadHistory: false, historyMsg: 'couldnt fetch history. please refresh pagee'})
        })
    }

    getGroupInfo = () => {
        this.setState({loadingFriends: true});
        let {groupId} = this.props;
        axios.get(`http://localhost:5000/chat/groups/groupinfo/${groupId}`)
        .then((el) => {
        
            let arr = el.data.groupMembers;
            let members = [];
            arr.forEach(el => {
                members.push(el.group_member_username);
            });
            this.setState({groupMembers: members});
            this.setState({loadingFriends: false});
            /*
            this.setState((prev) => {
                groupInfo.description
            })
            */
            }).catch(el => {

        });
    }
    getMessage = (msgBox) => {
        let {groupId} = this.props;
        
        let socket = io('http://localhost:5000');
        socket.on(groupId, (data) => {
            this.setState(prev => {
                let myMessages = prev.myMessages;
                myMessages = myMessages.concat(data);
                return {
                    myMessages: myMessages
                }
            })
        });
    }




    msgBox = (data, key = 1, msgHistory = false) => {
        // let {message, username, time} = data;
        let myUsername = this.props.userData.username;
        let thisUser;
        let thisGroupId;
        let thisTime;
        let thisMessage;
        if(msgHistory === true){
            let {group_member_username, group_id, group_message, timezone} = data;
             thisUser = group_member_username;
            thisMessage = group_message;
            thisTime = new Date(timezone).toLocaleString();
        } else {
            let {message, username, time} = data;
            thisMessage = message;
            thisUser = username;
            thisTime = time;
        }

        return (
            <>
        <div className = {`${styles.message__container} ${thisUser === myUsername && styles.toggled}`}>   
                    <div className = {styles.message__container__sent}>
                    <div className = {styles.message__image}> <Avatar size = 'large' src = {`/images/${thisUser}--profilepicture.png`}>U</Avatar> </div>
                    <div className = {styles.message__format}>
                    <div className = {styles.message__timestamp}><p className = {`${styles.message__username} ${thisUser && styles.toggled}`}>{thisUser}</p><p className = {`${styles.message__time}`}>{thisTime}</p></div>
        <div className = {styles.message__actualmessage}>{thisMessage}</div>
                    </div>
                    </div>
                    </div>
                    </>
        )
        }

  sendMessage = (e) => {
    e.preventDefault();
    let val = e.target.mymsg.value;
    let socket = this.props.socket;
    let {username} = this.props.userData;
    let time = new Date().toLocaleString();
    let msgInfo = {
        message: val,
        groupId : this.props.groupId,
        username : username,
        time: time,
    }
    socket.emit('groupMessage', msgInfo);
}
/*
    checkProfile = (username) => {
        let {token} = this.props.userData;
        axios.get(`http://localhost:5000/chat/${username}`, {
         headers: { Authorization:'Bearer' + token } })
        .then(el => {
            return <h1>hello</h1>
        }).catch(el =>{
            return (<div>hello world</div>)
        })
    }
    */
   checkGroupProfile = () => {
       let {groupId} = this.props;
    axios.get(`http://localhost:5000/chat/groups/profilepicture/${groupId}`).then(el => {
        let profilePicture = el.data.profilePicture;
        this.setState({groupProfile: profilePicture});
    }).catch(el => {
    })

   }

    render(){
        let msgBox = this.msgBox;
        let { groupName } = this.props;
        let socket = io('http://localhost:5000');

        const { TextArea } = Input;
        return (
            <div className = {styles.container__groupchatbox}>
            
                <div className = {styles.container__dialogue}>
                    <div className = {styles.container__dialogue__wrapper__container}>
                    <div className = {styles.container__dialogue__wrapper}> 
                    <div className = {styles.container__dialogue__messages}>
                    
                    <div className = {styles.container__sent__socket}>
            
                       {this.state.loadHistory ? <Spin/> : this.state.msgHistory.map((el, index) => {
                           return this.msgBox(el, index, true);
                       })}
                    </div>
                        
                    <div className = {styles.container__sent__socket}>
                        {this.state.myMessages.map((el, index) => {
                           return this.msgBox(el, index)
                       })}
                    </div>

                    </div>
                    </div>
                    </div> 
                <div className = {styles.container__messagebox}>
                    <form onSubmit = {this.sendMessage} className = {styles.form}>
                <TextArea className = {styles.textarea} name = 'mymsg' />
                <Button type = 'default' size = 'large' className = {styles.button} htmlType = 'submit'>Send</Button>
                </form>
                    </div>
                </div>

                <div className = {styles.container__groupinformation}>
                       <div className = {styles.container__groupinformation__wrapper}>
                       <div className = {styles.group__image__container}><Avatar size = {85} shape = 'circle' className = {styles.group__image} src = {`/images/${this.state.groupProfile}`} alt = 'profilepicture' />
                       <p className = {styles.title}>{this.props.groupName}</p>
                       </div>
                    <div className = {styles.group__name}><p className = {styles.title__description}>{this.props.description} </p></div>
                       </div>
                       <div className = {styles.group__members__container}>
                           <div className = {styles.group__members__heading}>
                           <TeamOutlined className = {styles.group__members__icon} /> <p className = {styles.title}>Group Members</p>
                           </div>
                           <div className = {styles.group__members__username__container}>
                           { this.state.loadingFriends ? <Spin/> : 
                           this.state.groupMembers.map((el, index) => {
                            return <div className = {styles.username__container}>
                                <Avatar key = {`${index}---isthekey`} shape = 'circle' size = 'large' src = {`/images/${el}--profilepicture.png`}>U </Avatar>
                                <p className = {styles.username}>{el}</p>
                                </div>
                            
                       }) }
                        </div>
                       </div>
                       <div></div>
                </div>

            </div>

        )
    }
}

export default Groupchatbox;