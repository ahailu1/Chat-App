import React from 'react';
import {Row, Col, Form, Input, Button, Tabs, Avatar, Badge} from 'antd';
import { AppleOutlined, LockFilled, MessageFilled , DeleteFilled,StarFilled, CheckCircleOutlined } from '@ant-design/icons';
import styles from './friendslist.module.scss';
import axios from 'axios';
import Friendrequests from './friendoptions/friendrequests';
import DisplayPending from './friendoptions/displayPending';
class Friendslist extends React.Component{
constructor(props){
    super(props);
    this.state = {
        friends: [],  
        value : '',
        pending: [],
        loggedIn: [],
        favourites : [],
        locked: [],
        pass: '',
        error: '',
    }
    this.handleButton = this.handleButton.bind(this);
    this.setLock = this.setLock.bind(this);

    this.deletePending = this.deletePending.bind(this); 
}
componentDidMount = () => {
    this.checkProps();
    this.getFavourites();
    this.getLocked();
}

handleChange = (e) => {
  const value = e.currentTarget.id;

  this.setState((prev) => {
    let target = !prev.toggled.value;
    return {
        toggled: target
    }  
});
}

checkProps = () => {
let {favourites,friends} = this.props;
}
    
handleIcon = (e) => {
    let val = e.currentTarget.id;
    console.log(typeof val);
    let myVal = this.state[val];
    console.log(!myVal);
    this.setState((prev) => {
        return{
            [val]: !myVal
        }
    });
}
    getFavourites = () => {
        let {favourites} = this.props;
        this.setState({favourites: favourites});
    }
    

    declineRequest = async (friendname) => {
    const {username} = this.props.userData;
    console.log(friendname);
    const request = await axios.get(`http://localhost:5000/chat/friendslist/declinerequest/${username}/${friendname}`);
    this.props.friendStatus();
}   
    deletePending = async (friendname) => {
        const {username} = this.props.userData;
        const request = await axios.get(`http://localhost:5000/chat/friendslist/deletepending/${username}/${friendname}`).then(() => {
            this.props.friendStatus();
        }).catch((err) => {
            alert('there was a problem');
        })
    }   
    confirmFriend = (friendName) => {
        const {username} = this.props.userData;
        axios.get(`http://localhost:5000/chat/friendslist/confirm/${username}/${friendName}`).then(data => {
                    this.props.friendStatus();
        }).catch(er => {
            alert('friend not addadsaded');
        });
       
    }
handleButton = (friendname) => {
    let {username} = this.props.userData;
    this.setState((prev) => {
        let locked = prev.locked;
        console.log(locked);
        locked = locked.concat(friendname);
        return {
            error: '',
            locked: locked
        }
    })
}
setLock = (friendname) => {
    console.log(this.state.locked);
    //take the friendname and set the lock
         this.setState((prev) => {
        let locked = prev.locked;
        locked = locked.concat(friendname);
        return {
            locked: locked
        }
    }, () => {
       console.log('right in the callback');
    });   
}
getLocked = () => {
    let {username} = this.props.userData;
    let data = this.props.fullList;
    let arr = [];
    console.log(data);
    data.forEach((el) => {
        console.log(el.state);
        console.log(typeof el.state);
        if(parseInt(el.state) === 3){
                if(el.username === username && (el.friendname_password !== null || el.friendname_password)){
                    arr.push(el.friendname);
                } else if(el.friendname === username && (el.username_password !== null || el.username_password)){
                    arr.push(el.username);
                } else {
                    console.log(el);
                }
        }
    });
    this.setState((prev) => {
        let thisArr = prev.locked;
        let myArr = thisArr.concat(arr);
        return{
            locked: myArr
        }
    })
}

render(){
    const {TabPane} = Tabs;
    let friendsList = {
        locked: true,
        myUsers : this.props.myUsers,
        favourite: true,
        userData: this.props.userData,
        myLock : this.state.locked,
        setLock :this.setLock,
        error: this.state.error,
       thisicon: (func, param) => { return <StarFilled className = {`${styles.myicon} ${param && styles.toggled}`} onClick ={func} id = 'star' /> },
    }
    let requests = {
        locked: false,
        favourite: true,
        userData: this.props.userData,
        avatar : false,
        thisicon: (func, param) => { return <CheckCircleOutlined onClick = {func} className = {`${styles.myicon} ${param && styles.toggled}`}/> }
    }
    let pending = {
        avatar : false,
        locked: false,
        favourite: false,
        userData: this.props.userData,
    }
    let favourite = {
        avatar : false,
        locked: false,
        favourite: false,
        userData: this.props.userData,
    }
    return(
        <Tabs defaultActiveKey = '2'>
            <TabPane key = "1" tab = 
            {
                <span className = {styles.tab}>
                   <AppleOutlined/> 
                   Friends
                </span>
            }
            >
                
                {/*<div className = {styles.container__addfriend}>
            <input type = 'text' name = 'addfriend' className = {styles.input} value = {this.state.value} onChange = {this.handleChange} />
            <Button htmlType = 'submit' type = 'primary' className = {styles.button} onClick = {this.addFriend} disabled = {this.state.value == '' ? true : false}>Add Friend </Button>
            </div>
            */
        }
            <div className = {styles.container__requests}>
                    { this.props.friends.length > 0  && this.props.friends.map((el, index) => {    
                    return <Friendrequests {...friendsList} isLocked = {this.state.locked.indexOf(el) == -1 ? false : true} setFunction = {() => {this.props.toggleFavourite(el, true)}} friendname = {el} key = {index} createChat = { () => { this.props.createChat(el) }} avatar = {() => {
                    return  <Avatar shape = 'circle' size = 'large' src = {`/images/${el}--profilepicture.png`} className = {styles.container__avatar} className = {`${styles.avatar}`} />                
                        }} />
                        })
                    }
                </div>
            </TabPane>
            <TabPane key = "2" tab = {
                <span className = {styles.tab}>
                   <AppleOutlined/> 
                   Requests
                </span>
                            }
                >
                    
                            {this.props.requests.map((el, index) => {
                                return <Friendrequests {...requests} setDelete = {() => {this.declineRequest(el); alert('hello')}} setFunction = {() => {this.confirmFriend(el)}} friendname = {el} key = {index} createChat = {() => { this.props.createChat(el)}}/>
                            })}
            </TabPane>
            <TabPane key = "3" tab = {
                <span className = {styles.tab}>
                   <AppleOutlined/> 
                   Pending
                </span>
                            }
                >
                    {this.props.pending.map( (el, index) => {
                        return <Friendrequests {...pending} displayIcon = {()=> false} friendname = {el} setDelete = { () => {this.deletePending(el) }} key = {index} createChat = {() => { this.props.createChat(el)}}/>;
                    })}
            </TabPane>
            <TabPane key = "4" tab = {
                <span className = {styles.tab}>
                   <AppleOutlined/> 
                   Favorites
                </span>
                            }
                >
                    {this.props.favourites.map(el => {
                        return <Friendrequests {...favourite} friendname = {el} createChat = {() => { this.props.createChat(el)}} friendName = {el} setDelete = {() => {this.props.toggleFavourite(el, false) }} avatar = {() => {
                            return  <Avatar shape = 'circle' size = 'large' src = {`/images/${el}--profilepicture.png`} className = {styles.container__avatar} className = {`${styles.avatar}`} />                
                                }} />
                    })}
            </TabPane>
        </Tabs>
    )
}

}
export default Friendslist;