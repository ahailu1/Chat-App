import React from 'react';
import {Row, Col, Form, Input, Button} from 'antd';
import styles from './homepage.module.scss';
import Loginform from './loginForm';
import Createaccount from './createaccount';
import axios from 'axios';
import Description from './description';
import { UploadOutlined, WechatOutlined, WechatFilled, TeamOutlined, LockOutlined, StarOutlined } from '@ant-design/icons';

class Homepage extends React.Component{
constructor(props){
    super(props);
    this.state = {
        name: null,

    }



}

render(){
    const firstDescription = {
        paragraph: 'this is a description of the title',
        heading: 'Chat with multiple people',
        icon: <WechatFilled/> 
    }
    const secondDescription = {
        paragraph: 'this is a description of the title',
        heading: 'Add A lock to your chat',
        icon: <LockOutlined/> 
    }
    const thirdDescription = {
        paragraph: 'Saved Chat History',
        heading: 'hasadsello',
        icon: <TeamOutlined/> 
    }
    return (
  <div>
      {this.props.render()}
      <Row className = {styles.container__row}>
          
<Col flex={5} className = {styles.container__column}>
            
            <div className = {styles.container__header}>Welcome to Instant Chat
            <br/>
            <p>This is a platform that allows you to add friends and start chatting immediately</p>
            </div>

    <div className = {styles.container__form}>
   <Loginform props = {this.props} handleLogin = {this.props.handleLogin}/>
   <Createaccount props = {this.props} handleLogin = {this.props.handleLogin}/>
   </div>
</Col>
</Row>
<Row className = {styles.container__row__two}>

<Col flex={5} className = {styles.container__column__two}>

   <Description {...firstDescription}/>
    <Description {...secondDescription}/>
    <Description {...thirdDescription}/>

</Col>
</Row>

  </div>
    );
}
}

export default Homepage;