import React from 'react';
import { Layout, Menu, Dropdown,Select,AutoComplete,  Spin } from 'antd';
import { UploadOutlined, WechatOutlined, WechatFilled, DownOutlined, UserAddOutlined } from '@ant-design/icons';
import {Link} from 'react-router-dom';
import styles from './header.module.scss';
import './header.css'
class Navbar extends React.Component{
constructor(props){
  super(props);
  //this.handleFilter = this.handleFilter.bind(this);

}
componentDidMount = () => {
}
/*
handleFilter = () => {
      const { Option } = Select;
      let {users,friends, requests, pending, declined} = this.props;
        return (
      
          <AutoComplete icon = {<UploadOutlined/>} placeholder="Search users" style={{ width: 200, color: 'green' }} className = {styles.container__users} filterOption={(inputValue, option) =>
            option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }>
          {users.map((el, index) => {
            if (friends.indexOf(el.value) !== -1) {
            return <Option key = {el.value} > <div className = {styles.container__options}><div className = {styles.container__username}>{el.value}</div><div className = {styles.container__icon}>Friends</div> </div></Option> 
                } else if(requests.indexOf(el.value) !== -1) {
           return <Option key = {el.value}> <div className = {styles.container__options}><div className = {styles.container__username}>{el.value}</div><div className = {styles.container__icon}>Requested</div> </div></Option> 
              } else if(pending.indexOf(el.value) !== -1){
            return <Option key = {el.value} > <div className = {styles.container__options}><div className = {styles.container__username}>{el.value}</div><div className = {styles.container__icon}>pending</div> </div></Option> 
              }else if(declined.indexOf(el.value) !== -1){
                return <Option key = {el.value} > <div className = {styles.container__options}><div className = {styles.container__username}>{el.value}</div><div className = {styles.container__icon}>pending</div> </div></Option> 

              } else {
               return <Option key = {el.value}> <div className = {styles.container__options}><div className = {styles.container__username}>{el.value}</div><div className = {styles.container__icon}><UserAddOutlined onClick = {() => this.props.addFriend(el.value)}/></div> </div></Option>
              }

              
                  }) }
            </AutoComplete>
          )
    }
*/
displayInfo = () => {

}
myMenu = () => {
  return (<Menu className = {styles.container__menu}>
<Menu.Item className = {styles.container__menu__item}>
  <a target = "_blank" rel = "noreferrer" onClick = {this.props.handleLogout}>Logout</a>
</Menu.Item>

  </Menu>
  )
}

render(){
    const {SubMenu} = Menu;
    const { Option } = Select;
    let users = this.props.users;
    return(
        //         <Menu theme = "dark" mode = "horizontal">
      <>
    { this.props.userData != null &&
    
    <Dropdown overlay = {this.myMenu} className = {styles.container__dropdown}>
      <a className= {styles.dropdown__item} onClick = {(e) => e.preventDefault()} >
        Hello, {this.props.userData.username} <DownOutlined />
      </a>
    </Dropdown>
}
</>
    )

}
}
export default Navbar;