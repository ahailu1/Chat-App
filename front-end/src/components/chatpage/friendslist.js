import React from 'react';
import {Row, Col, Form, Input, Button} from 'antd';
import { Tabs } from 'antd';
import { AppleOutlined, AndroidOutlined } from '@ant-design/icons';
import styles from './friendslist.module.scss';
import axios from 'axios';
import Friendrequests from './friendoptions/friendrequests';
class Friendslist extends React.Component{
constructor(props){
    super(props);
    this.state = {
        requests: null
    }
}

getRequests = async () => {
console.log('got');
    const request = await axios.get('http://localhost:5000/chat/friendslist/getfriends/test123');
    const data = request.data;
    this.setState({requests:data});

}




render(){
    const {TabPane} = Tabs;
    return(
        <Tabs defaultActiveKey = '2'>

            <TabPane key = "1" tab = {
                <span className = {styles.tab} onClick = {this.getRequests}>
                   <AppleOutlined/> 
                   Friends
                </span>
                            }
                >
                    {this.state.requests !== null && this.state.requests.map((el, index) => {
                        return <Friendrequests username = {el} key = {index} createChat = {this.props.createChat}  />
                    })}
            </TabPane>
            <TabPane key = "2" tab = {
                <span className = {styles.tab}>
                   <AppleOutlined/> 
                   Requests
                </span>
                            }
                >

            </TabPane>
            <TabPane key = "3" tab = {
                <span className = {styles.tab}>
                   <AppleOutlined/> 
                   Pending
                </span>
                            }
                >

            </TabPane>
        </Tabs>
    )
}

}
export default Friendslist;