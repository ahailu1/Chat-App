import React from 'react';
import {Layout, Tabs, AutoComplete, Select, Spin, Space, Popover} from 'antd';
import styles from './chat.module.scss';
import { UploadOutlined, CloseSquareFilled, UserAddOutlined } from '@ant-design/icons';
import Groupchatbox from './chatbox/groupchatbox';
import Profilepicture from './profilepicture';
import Friendslist from './friendslist';
import Chatbox from './chatbox/chatbox.js';
import io from 'socket.io-client';
import Cookies from 'universal-cookie';
import axios from 'axios';
import Navbar from '../header/header';
class Chat extends React.Component{

    constructor(props){
    super(props);
    this.state = {
        friends: [],
        initChat: [],
        users: [],
        initMessage: '',
        initGroupChat: [],
        toggled: [],
        pending: [],
        declined : [],
        requests : [],
        favourites: [],
        myUsers: [],
        fullList: [],
        loading: null,
        groupIdArr: [],
        globalVar : "https://instachatter.com",
        }

    this.createChat = this.createChat.bind(this);
    this.addFriend = this.addFriend.bind(this);
    this.toggleFavourite = this.toggleFavourite.bind(this);
        this.friendStatus = this.friendStatus.bind(this);
        this.createGroupChat = this.createGroupChat.bind(this);
        this.removeFriend = this.removeFriend.bind(this);
}

componentDidMount = () => {
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
                    axios.get(`${this.state.globalVar}/chat/friendslist/addfriend/${username}/${friendName}`).then(() => {

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


   createTab(id, isgroup) {
    let thisGroup = isgroup;

    let removeTab = (name, group) => {
    
  if(group === true) {
        this.setState((prev) => {
            let arr = [...prev.initGroupChat].map((el) => { return {...el} });
            let newArr = arr.filter(el => {
                if(el.groupId !== name){
                    return {...el};
                }
                else {
                }
            });
            return {
                initGroupChat: newArr
            }
        });
    } else {
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
}
    return (
        <div className = {styles.tab__container}>
            <span className = {styles.tab__icon}>
            <CloseSquareFilled className = {styles.tabicon} onClick = {() => {removeTab(id, thisGroup)}}/>
            </span>
            <span className = {styles.tab__name}>
            {id}
            </span>
            </div>
    )
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
    // if my username is the friendname then set state to six
    //if my username is the username then set te state to 5
    axios.get(`${this.state.globalVar}/chat/friendslist/setfavourites/${username}/${friendname}/${boolean}/${reverse}`).then(
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
    })
}

friendStatus = async () => {
        let [pending, requests, declined, favourites, friends, remainder,myList ] = [[], [], [], [], [], [], []];
            const {username} = this.props.userData;
            const request = await axios.get(`${this.state.globalVar}/chat/friendslist/friendstatus/${username}`);
            const data = request.data;
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
createGroupChat = (groupInfo) => {
   let initState = true;
   let initChat = [...this.state.initGroupChat];
this.setState((prev) => {
    let group = [...prev.initGroupChat].map(el => ({...el}));
    let obj = [...groupInfo].map(el => { return {...el} });
    let newGroup = group.concat(obj);
    return {
        initGroupChat: newGroup,
    }
});
}
removeFriend = (username) => {
        this.setState((prev) => {
            let friends = prev.friends;
            friends = friends.filter(el => {
                return el !== username;
            });
            return {
                friends: friends
            }
        });
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
        /*
    if(this.state.initChat.includes(friendname)){
        
        this.setState( (prev) => { 
            let newList = prev.toggled.includes(friendname) ? prev.toggled.filter(el => el != friendname) : prev.toggled.concat(friendname);
            return {toggled: newList}
        });
    } else
     { */
    this.setState((prev) => {

        if(!this.state.initChat.includes(friendname)){
        let arr = [...prev.initChat];
        arr.concat([userObject]);
        return{
            users: arr,
            initChat: prev.initChat.concat(friendname),
            initMessage: initialMessage 
            }
        }
        });
}
render(){
    let {friends, requests, pending, declined, favourites, myUsers, fullList} = this.state;
    let props = {friends, requests, pending, declined, favourites};
    const cookie = new Cookies();
    const userData = cookie.get('userData');
    let {username} = userData;
    const {Sider,Content} = Layout;
    const socket = io(`${this.state.globalVar}`);
    let friendsList = {
        toggleFavourite: this.toggleFavourite,
        loading: true,
        favourites: favourites, 
        requests : requests,  
        pending : pending,
        friends : friends,
        myUsers: myUsers,
        declined: declined,
        fullList: fullList,
        friendStatus : this.friendStatus,
        createChat : this.createChat,
        userData : userData,
        toggled : this.state.toggled, 
        socket : {socket},
        users : this.props.users,
        addFriend : this.addFriend,
    }
    let instructions = (<div className = {styles.popover__container}><p>To Change your profile picture,<br/> click on the avatar above your username</p></div>)
    const { TabPane } = Tabs;
    return(
        <Layout className = {styles.container__layout}>
        <Sider width = {450}  className = {styles.sidebar}>
        <div className = {styles.sidebar__profilepicture__container}>
        <Profilepicture className = {styles.profilepicture} userData = {userData} actionUrl = {`${this.state.globalVar}/chat/${username}`} setSize = {100}/>
        <Popover className = {styles.popover} content = {instructions} title = 'Info'><a href = '#'>{username}</a></Popover>
        </div>
        {this.state.loading != true ? <Friendslist userData = {userData} {...friendsList} removeFriend = {this.removeFriend} createGroupChat = {this.createGroupChat}/> : <this.loadingPage/>}
        </Sider>
        <Layout>
        <Content className = {styles.container__content}>

        <Tabs type = 'card' className = {styles.tab__card}>
        {this.state.initGroupChat.length > 0 && this.state.initGroupChat.map((el,index) => {
        return <TabPane tab = {this.createTab(el.groupId, true)} key = {`${index}/groupchat`}> 
                <Groupchatbox key = {`${index}---thisgroupchatbox`} socket = {socket} userData = {userData} groupId = {el.groupId} groupName = {el.groupName} description = {el.description}  />
                </TabPane>
            })
        }
        {
        this.state.initChat.length > 0 && this.state.initChat.map( (el, index) => {
            return <TabPane tab = {this.createTab(el, false) } key = {`${index}/chat`} >
            <Chatbox socket = {socket} userData = {userData} /*createProfile = {this.createProfile} */ toggled = {this.state.toggled} friendName = {el} key = {index} initMessage = {this.state.initMessage != '' ? this.state.initMessage : false }/>
            </TabPane>
        })
        }
        </Tabs>
        <div className = {styles.navbar__wrapper}>
        <Navbar declined = {declined} initUser = {true} pending = {pending} requests = {requests} addFriend = {this.addFriend} friends = {friends} handleLogout = {this.props.handleLogout} users = {this.props.users} userData = {this.props.userData}/>
        <div className = {styles.container__instructions}>
            <h1 className = {styles.instructions__header}>Instructions</h1>
            <p>All chats are created by clicking on the 'message' icon</p>
            <p>  <span className = {styles.instructions__header__item}>To Add a Friend</span> click on the 'friends' tab and click on the search bar to see a list of all users. To filter through that list, simply enter a character that the username contains. To add a user to the 'favourites' tab, click on the star under the 'friends' tab </p>
            <p>  <span className = {styles.instructions__header__item}>To view group options</span> click on the 'mygroups' tab which will display group-related options below. To join a group, click 'Join Group'; to create a group, click on the plus sign and fill in the form. To leave a group, click on the trashcan under the 'All Groups' tab. Groups are sorted only by GROUP ID</p>
            <p>  <span className = {styles.instructions__header__item}>To set a lock on your chat</span> click on the lock icon under the 'friends' tab, which will display an input box that requires a password and a password confirmation.<span className = {styles.instructions__header__item}>Once a lock is set, you will need a password to enter or view your chats.</span> 
            Locked chats will be colored <span className = {styles.instructions__header__item}> red.</span>To remove the password, enter the password that you created when you first set the lock.
            </p>
        </div>
        
        </div>
        </Content>
        </Layout>
        </Layout>
            )
    }
}
export default Chat