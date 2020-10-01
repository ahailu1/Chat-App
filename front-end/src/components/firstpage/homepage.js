import React from 'react';
import {Row, Col, Form, Input, Button} from 'antd';
import {LinkedinOutlined, GithubOutlined, PhoneOutlined, MailOutlined} from '@ant-design/icons';
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
myFooter = () => {
    return(

        <>
          <Col span={6} className = {styles.footer__column__two}>
      <div className = {styles.footer__header__main}>About</div>
        <div className = {styles.footer__container__about}>This is a chat application that allows you to create an account, add friends, create groups. Users are allowed to add their friends to 'favourites' and can set a lock to their conversations so that a password must be entered to chat or view conversation history.   </div>
          
        </Col>    
        <Col span={6} className = {styles.footer__column__two}>
        <div className = {styles.footer__header__main}>Contact</div>
      <div className = {`${styles.footer__container__contact}`}>
        <div className = {styles.rre}>
            <div className = {styles.footer__icon__container}> <LinkedinOutlined className = {styles.icon__contact}/><a href = 'https://www.linkedin.com/in/alexanderhailu'>LinkedIn</a> </div>
            <div className = {styles.footer__icon__container}><GithubOutlined className = {styles.icon__contact}/> <a href = 'https://github.com/ahailu1'>Github</a></div>
            <div className = {styles.footer__icon__container}><MailOutlined className = {styles.icon__contact}/> alex.hailu@hotmail.com</div>
        </div>
      </div>
        </Col>
      <Col span={6} className = {styles.footer__column__two}>
          <div className = {styles.footer__header__main}>Technologies Used</div>
      <div className = {`${styles.footer__container__technologies}`}>
        
        <div>
            <p className = {styles.footer__header}>Front End</p>
        <p>ReactJS</p>
        <p>CSS</p>
        <p>SASS</p>
        <p>Socket Io</p>        
        <p>Ant Design</p>
        </div>
        <div>
            <p className = {styles.footer__header}>Back End</p>
        <p>NodeJS</p>
        <p>ExpressJs</p>
        <p>Socket Io</p>    
        <p>PostgreSQL</p>    
        </div>
        <div>
            <p className = {styles.footer__header}>Misc</p>
        <p>Git Version Control</p>
        <p>NGINX Web Server</p>
        <p>Linux OS</p>    
        </div>
      </div>
      </Col>
      <Col span={6} className = {styles.footer__column__two}>
      <div className = {styles.footer__header__main}>About</div>
        <div className = {styles.footer__container__about}>
            I am an aspiring Web Developer that has been working on this application over the past 9 months. I started with basic knowlege of PHP and javascript and zero knowledge of Node.js, but decided that 
            to find a job as a web-developer, I ought to learn tools that are 'in demand.' I created this application because it required an integration of CRUD Operations and REST API-s, which forced me to get both a practical and a knowledge-based understanding of such concepts.
     </div>
          
        </Col> 
</>
    )
}    

render(){
    const firstDescription = {
        paragraph: 'Create and join groups within 2 clicks. Just enter your description, group-ID and Group Name',
        heading: 'Create Groups',
        icon: <WechatFilled/> 
    }
    const secondDescription = {
        paragraph: 'Add a lock to your chat so that you need to enter a password to initiate conversations',
        heading: 'Add A lock to your chat',
        icon: <LockOutlined/> 
    }
    const thirdDescription = {
        paragraph: 'all conversation history is saved so that when you log out and then log back in, your conversation is still there',
        heading: 'Saved Conversation History',
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
<Row className = {styles.footer__row}>
{this.myFooter()}
</Row>

  </div>
    );
}
}

export default Homepage;