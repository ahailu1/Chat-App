import React from 'react';
import {Row, Col, Form, Input, Button, Layout, Avatar, Upload} from 'antd';
import styles from './chat.module.scss';
import { UploadOutlined } from '@ant-design/icons';
import Profilepicture from './profilepicture';
import Friendslist from './friendslist';

class Chat extends React.Component{
constructor(props){
    super(props);

}



render(){
    const {Sider,Content} = Layout;

    return(
        <Layout className = {styles.container__layout}>
        <Sider width = {325}  className = {styles.sidebar}>
        <Profilepicture/>
        <Friendslist/>
        </Sider>
        <Content>


        </Content>
        </Layout>
            )
    }
}

export default Chat