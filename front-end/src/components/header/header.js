import React from 'react';
import { Layout, Menu, Dropdown,Select,AutoComplete,  Spin } from 'antd';
import { UploadOutlined, WechatOutlined, WechatFilled, DownOutlined, UserAddOutlined } from '@ant-design/icons';
import {Link} from 'react-router-dom';
import styles from './header.module.scss';
import './header.css'
class Navbar extends React.Component{
constructor(props){
  super(props);
  this.handleFilter = this.handleFilter.bind(this);

}
componentDidMount = () => {
}

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

render(){
    const {Header, Content,Footer} = Layout;
    const {SubMenu} = Menu;
    const { Option } = Select;
    let users = this.props.users;
    return(
        // 
      <Header className = {styles.container__header}>
        <Menu theme = "dark" mode = "horizontal">

                    {this.props.initUser !== false && this.handleFilter()}
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