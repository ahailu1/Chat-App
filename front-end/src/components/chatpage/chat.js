import React from 'react';
import {Layout, Tabs, Avatar, Menu, AutoComplete, Select, Spin, Space} from 'antd';
import styles from './chat.module.scss';
import { UploadOutlined, CloseSquareFilled, UserAddOutlined } from '@ant-design/icons';
import Profilepicture from './profilepicture';
import Friendslist from './friendslist';
import Chatbox from './chatbox';
import io from 'socket.io-client';
import Cookies from 'universal-cookie';
import axios from 'axios';
import Navbar from '../header/header';
class Chat extends React.PureComponent{

    constructor(props){

    super(props);
    this.state = {
        friends: [],
        initChat: [],
        users: [],
        initMessage: '',
        toggled: [],
        pending: [],
        declined : [],
        requests : [],
        favourites: [],
        myUsers: [],
        fullList: [],
        loading: true
        }

    this.createChat = this.createChat.bind(this);
    this.removeTab = this.removeTab.bind(this);
    this.addFriend = this.addFriend.bind(this);
    this.toggleFavourite = this.toggleFavourite.bind(this);
        this.friendStatus = this.friendStatus.bind(this);
}

componentDidMount = () => {
    this.createSocket();
    this.friendStatus();
}


handleFilter = () => {
    const { Option } = Select;

      let users = this.props.users;
      let {friends, requests, pending} = this.state;

      let arr = [];
      friends.forEach((el) => {
        arr.push(el.friendname)
      });
      return (
      
      <AutoComplete icon = {<UploadOutlined/>} placeholder="Search users" style={{ width: 200, color: 'green' }} className = {styles.container__users} filterOption={(inputValue, option) =>
        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
      }>
      {users.map((el, index) => {
        if(arr.indexOf(el.value) !== -1){
          return <Option key = {el.value} > <div className = {styles.container__options}><div className = {styles.container__username}>{el.value}</div><div className = {styles.container__icon}>Friends</div> </div></Option> 
                  } else if(requests.indexOf(el.value) !== -1) {
       return <Option key = {el.value}> <div className = {styles.container__options}><div className = {styles.container__username}>{el.value}</div><div className = {styles.container__icon}><UserAddOutlined onClick = {() => this.props.addFriend(el.value)}/></div> </div></Option> 
          } else if(pending.indexOf(el.value) !== -1){
        return <Option key = {el.value} > <div className = {styles.container__options}><div className = {styles.container__username}>{el.value}</div><div className = {styles.container__icon}>pending</div> </div></Option> 
          } else {
           return <Option key = {el.value}> <div className = {styles.container__options}><div className = {styles.container__username}>{el.value}</div><div className = {styles.container__icon}><UserAddOutlined onClick = {() => this.props.addFriend(el.value)}/></div> </div></Option>
          }
          
              }) }
        </AutoComplete>
      )
  }

        addFriend = async (friendname) => {
            const friendName = friendname;
            const {username} = this.props.userData;
                if(this.state.requests.includes(friendName)) {
                    alert('name taken')
                } else if (this.state.pending.includes(friendName)){
                    alert('name is pending')
                } else if(this.state.friends.some(el => el === friendName)) {
                    alert('name already added');
                } else {
                    axios.get(`http://localhost:5000/chat/friendslist/addfriend/${username}/${friendName}`).then(() => {

                        this.setState((prev) => {
                            let pending = prev.pending.concat(friendName);
                            return {
                                value: '',
                                pending: pending
                            }
                        })                    
                    })
                }
           
                    }


createTab = (el) => {
    return (
        <div className = {styles.tab__container}>
            <span className = {styles.tab__icon}>
            <CloseSquareFilled className = {styles.tabicon} onClick = { () => { this.removeTab(el) }}/>
            </span>
            <span className = {styles.tab__name}>
            {el}
            </span>
            </div>
    )
}


removeTab = (name) => {

    this.setState((prev) => {
        let newList = prev.initChat;
        newList = newList.filter((el) => {
            return el != name;
        });
        return {
            initChat: newList
        }


    })

}

createSocket = () => {
    const socket = io('http://localhost:5000');
    const cookie = new Cookies();
    const userData = cookie.get('userData');
    const {username} = userData;
    const data = {
        username,
        online: true,
    }
    socket.emit('login', data);
    
    setTimeout(() => {
    socket.emit('login', data);
        }, 5000);

    socket.on(username, (data) => {
        if (!this.state.initChat.includes(data.sender)) { 
            this.createChat(data.sender, data.message);
        } else {

        }

    });
    //send message that indicates you are logged in
    // once message is sent sent and received, 
    //receive message that indicates you are logged in
}


toggleUser = (friendname) => {
this.setState((prev) => {
    let newList = prev.filter((el) => {
    return el != friendname
    });
    return {
        initChat : newList
    }
})
}
toggleFavourite = (myfriendname, boolean) => {
    let {username} = this.props.userData;
    let friendname = myfriendname;
    let reverse;
    if(this.state.myUsers.indexOf(friendname) !== -1){
        // if my username is under the 'friendname' category and my friendname is under the username category, then update username is favourite where username = friendname and friendname == username
        reverse = 1;
    } else {
        reverse = 2;
    }
    axios.get(`http://localhost:5000/chat/friendslist/setfavourites/${username}/${friendname}/${boolean}/${reverse}`).then(
        this.setState(prev => {
            let myFavourites;
            let favourites = prev.favourites;
            let myFriends = prev.friends;
            if(boolean === false || boolean === 'false'){
                myFavourites = favourites.filter(el => el != myfriendname);
                myFriends = myFriends.concat(myfriendname);
            } else {
                myFriends = myFriends.filter(el => el != friendname);
                myFavourites = favourites.concat(myfriendname);
            }
            return{
                friends: myFriends,
                favourites: myFavourites
            }
        })
    ).catch(err => {
        console.log(err + 'could not set favorutes');
    })
}

friendStatus = async () => {
        let [pending, requests, declined, favourites, friends, remainder,myList ] = [[], [], [], [], [], [], []];
            const {username} = this.props.userData;
            const request = await axios.get(`http://localhost:5000/chat/friendslist/friendstatus/${username}`);
            const data = request.data;
            console.log(data);
            data.forEach((el) => {
                 if(el.friendname === username && myList.indexOf(el.username) == -1){
                        myList.push(el.username);
                     }   

                if((el.state === '3' && el.friendname === username && el.username_isfavourite !== true) || (el.state === '3' && el.username === username && el.friendname_isfavourite !== true)) {
                    // check if the friendname is my name//
                    let res  = el.friendname === username ? el.username : el.friendname;

                    if(friends.indexOf(res) == -1) {

                        friends.push(res);
                    } 
                } else if(el.state == '1' && el.username === username){
                    pending.push(el.friendname);
                } else if(el.state == '1' && el.friendname === username){
                    requests.push(el.username);
                } else if (el.state === '4' && el.username === username){
                    declined.push(el.friendname)
                } else if((el.username === username && el.friendname_isfavourite === true) || (el.friendname === username && el.username_isfavourite === true)){
                    let add = el.friendname === username ? el.username : el.friendname;
                    if(favourites.indexOf(add) === -1){
                    favourites.push(add);
                }
                }
            });
            this.setState((prev) => {
                    return {
                        friends: friends,
                        pending: pending,
                        requests: requests,
                        declined: declined,
                        favourites: favourites,
                        myUsers: myList,
                        fullList: data,
                        loading: false
                    }
            });
        }

loadingPage = () => {

    return(
        <Space className = {`${styles.spinner}`}>
        <Spin size = 'large'/>
        </Space>
    )
}

createChat = (friendname, initialMessage = '') => {
    const cookie = new Cookies();
    const userData = cookie.get('userData');
    const {username} = userData;
    const userObject = {
        sender: username,
        recipient: friendname,
        messages: [],
        initialMessage:[],
    }

    if(this.state.initChat.includes(friendname)){
        
        this.setState( (prev) => { 
            let newList = prev.toggled.includes(friendname) ? prev.toggled.filter(el => el != friendname) : prev.toggled.concat(friendname);
            return {toggled: newList}
        });
    } else {
    this.setState((prev) => {
        const arr = [...prev.initChat];
        arr.push(userObject);
        return{
            users: arr,
            initChat: prev.initChat.concat(friendname),
            initMessage: initialMessage 
            }
        });
    }
}

render(){
    let {friends, requests, pending, declined, favourites, myUsers, fullList} = this.state;
    let props = {friends, requests, pending, declined, favourites};
    const cookie = new Cookies();
    const userData = cookie.get('userData');
    const {Sider,Content} = Layout;
    const socket = io('http://localhost:5000');
    let friendsList = {
        toggleFavourite: this.toggleFavourite,
        loading: true,
        favourites: favourites, 
        requests : requests,  
        pending : pending,
        friends : friends,
        myUsers: myUsers,
        fullList: fullList,
        friendStatus : this.friendStatus,
        createChat : this.createChat,
        userData : userData,
        toggled : this.state.toggled, 
        socket : {socket}
    }
    const { TabPane } = Tabs;
    return(
        <Layout className = {styles.container__layout}>
        <Sider width = {450}  className = {styles.sidebar}>
        <Profilepicture userData = {userData}/>
{ this.state.loading != true ? <Friendslist {...friendsList}/> : <this.loadingPage/>}
        </Sider>
        <Layout>
            <Navbar declined = {declined} initUser = {true} pending = {pending} requests = {requests} addFriend = {this.addFriend} friends = {friends} handleLogout = {this.props.handleLogout} users = {this.props.users} userData = {this.props.userData}
             />
        <Content className = {styles.container__content}>
            
        <Tabs type = 'card' className = {styles.tab__card}>
        {
        this.state.initChat.length > 0 && this.state.initChat.map( (el, index) => {
           
            return <TabPane tab = {this.createTab(el) } key = {index} >
            <Chatbox socket = {socket} userData = {userData} /*createProfile = {this.createProfile} */ toggled = {this.state.toggled} friendName = {el} key = {index} initMessage = {this.state.initMessage != '' ? this.state.initMessage : false }/>
            </TabPane>
        })
        }
        </Tabs>
        </Content>
        </Layout>
        </Layout>
            )
    }
}

export default Chat