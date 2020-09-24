import React, {useState, useEffect} from 'react';
import {Layout, Tabs, Avatar, Menu, AutoComplete, Select, Spin, Space, Button} from 'antd';
import styles from './creategroup.module.scss';
import { PlusCircleOutlined, DeleteOutlined, MinusCircleOutlined, UserOutlined, MessageOutlined} from '@ant-design/icons';
import axios from 'axios';
const Creategroup = (props) => {

const [creategroup, toggleDisplay] = useState(false);    
const [deleteIcon, changeDelete] = useState(false);    


const toggleDelete = () => {
    changeDelete(!deleteIcon)
}
const insertGroup = (e) =>{
    e.preventDefault();
    let {username} = props.userData;
    let groupName = e.target.group_name.value;
    let groupId = e.target.group_id.value;
    let groupDescription = e.target.group_description.value;
    let config = {
    method: 'POST',
    url : 'http://localhost:5000/chat/groups/create',
    data: {
    groupName,
    groupId,
    groupCreator: username,
    groupDescription,
    }
};
    axios(config).then(res => {
        let {data} = res;
        console.log(data);
    });
}

const initChat = () => {
    let groupInfo = {
        description: props.groupDescription,
        groupId : props.groupId,
        groupName: props.groupName,
    }
    props.createGroupChat(groupInfo);

}

let fetchGroup = () => {

    return (
        <>
        <div className = {styles.container}>
    
        
        <div className = {styles.container__groupdata}>
            
            <div className = {`${styles.container__groupdata__avatar} ${props.joinedGroups && styles.toggled}`}>   
                <div className = {styles.container__groupdata__avatar__container}>
        <Avatar size = {50} className = {styles.icon__delete}/>
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
            <DeleteOutlined className = {`${styles.icon__delete}`} onClick = {toggleDelete}/>
        </div>
            <div>
                <MinusCircleOutlined className = {styles.icon__delete}/>
            </div>
                    <div>
                        <MessageOutlined className = {styles.icon__delete} onClick = {initChat}/>
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