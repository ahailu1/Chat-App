import React from 'react';
import { Layout, Menu } from 'antd';
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
        <Menu.Item key="1">Home</Menu.Item>
        <Menu.Item key="2">Chat</Menu.Item>
        <Menu.Item key="3" theme = "dark">About</Menu.Item>
        </Menu>
    </Header>
    )

}

}
export default Navbar;