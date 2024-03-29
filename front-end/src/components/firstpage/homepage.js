import React from 'react';
import {Row, Col} from 'antd';
import {LinkedinOutlined, GithubOutlined, PhoneOutlined, MailOutlined} from '@ant-design/icons';
import styles from './homepage.module.scss';
import Loginform from './loginForm';
import Createaccount from './createaccount';
import Description from './description';
import { WechatFilled, TeamOutlined, LockFilled } from '@ant-design/icons';

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
          <Col xs={24} sm={16} md={12} lg={6}className = {styles.footer__column__two}>
      <div className = {styles.footer__header__main}>About</div>
        <div className = {styles.footer__container__about}>This is a chat application that allows you to create an account, add/delete friends, and create/delete groups. Users are allowed to add friends to 'favourites' and can set a lock to their conversations so that a password must be entered to chat or view conversation history.   </div>
          
        </Col>    
        <Col xs={24} sm={16} md={12} lg={4} className = {styles.footer__column__two}>
        <div className = {styles.footer__header__main}>Contact</div>
      <div className = {`${styles.footer__container__contact}`}>
        <div className = {styles.rre}>
            <div className = {styles.footer__icon__container}> <LinkedinOutlined className = {styles.icon__contact}/><a href = 'https://www.linkedin.com/in/alexanderhailu'>LinkedIn</a> </div>
            <div className = {styles.footer__icon__container}><GithubOutlined className = {styles.icon__contact}/> <a href = 'https://github.com/ahailu1'>Github</a></div>
            <div className = {styles.footer__icon__container}><MailOutlined className = {styles.icon__contact}/> alex.hailu@hotmail.com</div>
        </div>
      </div>
        </Col>
      <Col xs={24} sm={16} md={12} lg={7} className = {styles.footer__column__two}>
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
      <Col xs={24} sm={16} md={12} lg={7} className = {`${styles.footer__column__two} ${styles.information}`}>
      <div className = {styles.footer__header__main}>About</div>
        <div className = {styles.footer__container__about}>
    I am an aspiring Web Developer and this is my very first web-application. 
    I started with elementary knowledge of both PHP and Javascript and with little knowledge of Node.js and ReactJs.
    I wanted to learn not only new programming languages, but also things such as CRUD operations and Rest-Apis, both of which are prevalent in the world of programming.
    I figured the best way to learn is to build, which is why I created this program in such a way that integrates those important concepts.
    I've kept this application in my portfolio to show where I started and how far i've come as shown in my other projects.
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
        paragraph: 'Add a lock to your so that no one can view your conversations without a password',
        heading: 'Lock your chat',
        icon: <LockFilled/> 
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
            
            <div className = {styles.container__header}>Welcome to my Chat Application
            <br/>
            <p>This is a platform that allows you to add friends, create groups, and start chatting immediately</p>
            </div>

    <div className = {styles.container__form}>
   <Loginform props = {this.props} handleLogin = {this.props.handleLogin}/>
   <Createaccount props = {this.props} handleLogin = {this.props.handleLogin}/>
   </div>
</Col>
</Row>
<Row className = {styles.container__row__two}>

<Col xs={0} sm={0} md={12} lg={12} xl={12} className = {styles.container__column__two}>
   
</Col>
<Col xs={24} sm={24} md={12} lg={12} xl={12} className = {styles.container__column__three}>
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