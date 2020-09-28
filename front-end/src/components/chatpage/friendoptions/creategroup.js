import React, {useState, useEffect} from 'react';
import {Layout, Tabs, Avatar, Menu, AutoComplete, Select, Spin, Space, Button} from 'antd';
import styles from './creategroup.module.scss';
import { PlusCircleOutlined, DeleteFilled, MinusCircleFilled, UserOutlined, MessageFilled} from '@ant-design/icons';
import Profilepicture from '../profilepicture';
import axios from 'axios';
const Creategroup = (props) => {

const [creategroup, toggleDisplay] = useState(false);    
const [deleteIcon, changeDelete] = useState(false);    
const [chatIcon, changeChat] = useState(false);    


const toggleDelete = () => {
    changeDelete(!deleteIcon)
    changeChat(!chatIcon);
}
const toggleChat = () => {
    changeDelete(!deleteIcon)

}

const initChat = () => {
    let groupInfo = {
        description: props.groupDescription,
        groupId : props.groupId,
        groupName: props.groupName,
    }
    props.createGroupChat(groupInfo);

}
const leaveMyGroup = (username, groupId) => {
    props.deleteFunc(username,groupId); 
    toggleDelete();
}

let fetchGroup = () => {

    return (
        <>
        <div className = {styles.container}>
    
        
        <div className = {styles.container__groupdata}>
            
            <div className = {`${styles.container__groupdata__avatar} ${props.joinedGroups && styles.toggled}`}>   
                <div className = {styles.container__groupdata__avatar__container}>
                { props.setProfile ? <Profilepicture actionUrl = {`http://localhost:5000/chat/groups/profilepicture/${props.groupId}`} userData = {props.userData} toggled = {true} setSize = {50}/>
                 : <Avatar src = {`/images/${props.groupId}--profilepicture.png`} size = {64} />  
                }
                </div>
                {props.description &&
            <div className = {styles.container__groupdata__avatar__description}>
            <p className = {`${styles.title}`}>Description</p>
                <p className = {styles.title__description}>{props.groupDescription}</p>
            </div>
                }
        </div>

            <div className = {`${styles.container__groupdata__information} ${props.joinedGroups && styles.toggled}`}>
            <div className = {`${styles.container__groupid} ${props.joinedGroups && styles.toggled}`}>
                    <p className = {`${styles.title} ${props.joinedGroups && styles.toggled}`}>Group Id </p>
                    <p className = {styles.title__description}>{props.groupId}</p>
                </div>
                    <div className = {styles.container__groupname}>
                        <p className = {`${styles.title} ${props.joinedGroups && styles.toggled}`}>Group Name</p>
                        <p className = {styles.title__description}> {props.groupName}</p>
                    </div>
             </div>
        </div>
    
        <div className = {styles.container__icons}>
        <div>
            <DeleteFilled className = {`${styles.icon} ${styles.icon__delete} ${deleteIcon && styles.toggled}`} onClick = {toggleDelete}/>
            <div className = {`${styles.container__icons__deletebutton} ${deleteIcon && styles.toggled}`}>
                <Button onClick = {() => leaveMyGroup(props.userData.username, props.groupId)}>Leave</Button>             <Button onClick = {toggleDelete}>No</Button>
            </div>
        </div>
                    <div>
                        <MessageFilled className = {`${styles.icon} ${styles.icon__chat} ${chatIcon && styles.toggled}`} onClick = {initChat}/>
            
                    </div>    
        </div>        
        </div>
    </>
    )
}
    return(
    fetchGroup()
    )

}
export default Creategroup;