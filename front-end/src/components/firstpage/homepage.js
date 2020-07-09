import React from 'react';
import {Row, Col, Form, Input, Button} from 'antd';
import styles from './homepage.module.scss';
import Loginform from './loginForm';
import Createaccount from './createaccount';
import axios from 'axios';
import Description from './description';
import { UploadOutlined, WechatOutlined, WechatFilled, TeamOutlined } from '@ant-design/icons';

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
        heading: 'hasadsello',
        icon: <WechatFilled/> 
    }
    const secondDescription = {
        paragraph: 'this is a description of the title',
        heading: 'hasadsello',
        icon: <TeamOutlined/> 
    }
    const thirdDescription = {
        paragraph: 'this is a description of the title',
        heading: 'hasadsello',
        icon: <TeamOutlined/> 
    }
    return (
  <div>
      <Row className = {styles.container__row}>
          
<Col flex={5} className = {styles.container__column}>
            
            <div className = {styles.container__header}>Welcome to Instant Chat
            <br/>
            <p>This is a platform that allows you to add friends and start chatting immediately</p>
            </div>

    <div className = {styles.container__form}>
   <Loginform/>
   <Createaccount/>
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