import React from 'react';
import { Layout, Menu } from 'antd';
import {Link} from 'react-router-dom';
import './header.css'
class Navbar extends React.Component{
constructor(props){
    super(props);
}

render(){
    const {Header, Content,Footer} = Layout
  return(
      <Header>
        <Menu theme = "dark" mode = "horizontal">
        <Menu.Item key="1"><Link  to = '/'>Home</Link></Menu.Item>
        <Menu.Item key="2"><Link  to = '/chat'>Chat</Link></Menu.Item>
        <Menu.Item key="3">About</Menu.Item>
        </Menu>
    </Header>
    )

}

}
export default Navbar;