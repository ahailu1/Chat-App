import React from 'react';
import styles from './groupchatbox.module.scss';
import {Input, Button} from 'antd';
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
        }
        this.msgBox = this.msgBox.bind(this);
    }
    componentDidMount = () => {
        this.getMessage();
        this.getGroupInfo();
    }

    getGroupInfo = () => {
        let {groupName} = this.props;
        axios.get(`http://localhost:5000/chat/groups/groupinfo/${groupName}`)
        .then((el) => {
            let arr = el.data.groupMembers;
            let members = [];
            arr.forEach(el => {
                members.push(el.group_member_username);
            });
            this.setState({groupMembers: members});
            /*
            this.setState((prev) => {
                groupInfo.description
            })
            */
            console.log(el.data.groupMembers);
        }).catch(el => {

        });
    }

    getMessage = (msgBox) => {
        let {groupName} = this.props;
        
        let socket = io('http://localhost:5000');
        socket.on(groupName, (data) => {
            this.setState(prev => {
                let myMessages = prev.myMessages;
                myMessages = myMessages.concat(data);
                return {
                    myMessages: myMessages
                }
            })
        });
    }

    msgBox = (data, key = 1) => {
        let {message, username, time} = data;

        return (
            <>
        <div className = {`${styles.message__container} ${key % 2 == 0 && styles.toggled}`}>   
                    <div className = {styles.message__container__sent}>
                    <div className = {styles.message__image}> <h1>image</h1> </div>
                    <div className = {styles.message__format}>
                    <div className = {styles.message__timestamp}><p className = {`${styles.message__username} ${key % 2 != 0 && styles.toggled}`}>{username}</p><p className = {`${styles.message__time}`}>{time}</p>
                    </div>
        <div className = {styles.message__actualmessage}>{message}</div>
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
        groupId : this.props.groupName,
        username : username,
        time: time,
    }
    socket.emit('groupMessage', msgInfo);
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
                    <div className = {styles.container__sent__socket}>
                       {this.state.myMessages.map((el, index) => {
                           return this.msgBox(el, index)
                       })}
                        </div>
                        <div className = {styles.container__sent__history}> hello world </div>

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
                       <div className = {styles.group__image}>Image</div>
                    <div className = {styles.group__name}><p className = {styles.title}>Group Name</p><p className = {styles.title__description}> {this.props.groupName} </p></div>
                    <div className = {styles.group__description}>{this.props.description}</div>
                       </div>
                       <div className = {styles.group__members__container}>
                           <div className = {styles.group__members__heading}>
                           <TeamOutlined className = {styles.group__members__icon} /> <p>Group Members</p>
                           </div>
                           {this.state.groupMembers.map(el => {
                            return <p>{el}</p>
                       }) }</div>
                       <div>is Online</div>
                </div>

            </div>

        )
    }
}

export default Groupchatbox;