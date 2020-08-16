import React from 'react';
import { Layout, Menu, Dropdown } from 'antd';
import { UploadOutlined, WechatOutlined, WechatFilled, DownOutlined } from '@ant-design/icons';
import {Link} from 'react-router-dom';
import styles from './header.module.scss';
import './header.css'
class Navbar extends React.Component{
constructor(props){
    super(props);
}

render(){
    const {Header, Content,Footer} = Layout;
    const {SubMenu} = Menu;
    return(
        // 
      <Header>
        <Menu theme = "dark" mode = "horizontal">
        <Menu.Item key="1"><Link  to = '/'>Home</Link></Menu.Item>
        <Menu.Item key="2"><Link  to = '/chat'>Chat</Link></Menu.Item>
        <Menu.Item key="3">About</Menu.Item>
    {this.props.userData != null && 
    <SubMenu icon = {<DownOutlined />} className = {`${styles.submenu}`} title = {`Welcome ${this.props.userData.username}`} > 
    <Menu.Item key="4" className = {`${styles.logout}`} onClick = {this.props.handleLogout}>Logout</Menu.Item>
    </SubMenu>
}
        </Menu>
    </Header>
    )

}

}
export default Navbar;