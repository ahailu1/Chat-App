import React from 'react';
import {Button, Tabs, Avatar, Spin, AutoComplete, Select} from 'antd';
import { AppleOutlined,UsergroupAddOutlined, LockFilled, MessageFilled , DeleteFilled,StarFilled, CheckCircleOutlined, PlusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import styles from './friendslist.module.scss';
import axios from 'axios';
import Friendrequests from './friendoptions/friendrequests';
import Creategroup from './friendoptions/creategroup';
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
        myGroups: [],
        allGroups : [],
        joinedGroups: [],
        loading: null,
        toggleGroup: false,
        groupId : '',
        loadJoined: null,
        joinGroupError: ''
    }
    this.setLock = this.setLock.bind(this);
    this.deletePending = this.deletePending.bind(this); 
}
componentDidMount = () => {
    this.getFavourites();
    this.getLocked();
    this.getmyGroup();
    this.fetchAllGroups();
    this.getJoinedGroups();
}

fetchAllGroups = () => {
    axios.get('http://localhost:5000/chat/groups/allgroups').then(el => {
    console.log(el);
    console.log(el.data);
    this.setState({allGroups: el.data});
    }).catch(el => {

    })
}

getmyGroup = () => {
    let {username} = this.props.userData;
    console.log(username);
    axios.get(`http://localhost:5000/chat/groups/mygroups/${username}`).then(res => {
        let groupInfo = res.data.groupData;
        console.log(groupInfo);
        console.log('right here');
    this.setState({myGroups: groupInfo, loading: false});
    }).catch(res => {
        this.setState({loading: false});

    })
}
getJoinedGroups = () => {

    this.setState({loadJoined: true});

    let {username} = this.props.userData;
    console.log(username);
    axios.get(`http://localhost:5000/chat/groups/joinedgroups/${username}`).then(res => {
        let groupInfo = res.data;
        console.log(groupInfo);
        console.log('right here');
    this.setState({joinedGroups: groupInfo, loadJoined: false});
    }).catch(res => {
        this.setState({loadJoined: false});
    })
}
handleInputChange = (e) => {
 let myGroupId = e;
this.setState({groupId: myGroupId });    
}

handleJoinGroup = () => {
    let { username } = this.props.userData;
    let {groupId} = this.state;
    console.log(groupId);
    let groupInfo = this.state.allGroups.filter((el) => {
        if(el.group_id === groupId){
            return el;
        }
    });
    console.log(groupInfo);

    if(groupInfo.length != 0){
        axios.get(`http://localhost:5000/chat/groups/join/${groupId}/${username}`).then(res => {
       
            this.setState((prev) => {
                    let myGroup = prev.joinedGroups;
                    myGroup = myGroup.concat(groupInfo);
                    return {
                        joinedGroups: myGroup,
                        joinGroupError: 'Group Joined',
                    }
                });
            })
            .catch(err => {
        
            })
    } else {
        this.setState({joinGroupError: 'Could Not Join Group. Please Enter A Valid Group ID'})
    }
    
    //check if user is in group
    //if he is
}
listGroups = () => {
    const { Option } = Select;
      
      return (
          <>
      <div className = {styles.container__dropdown}>
      <AutoComplete name = 'myautocomplete' placeholder="Search users" onChange = {this.handleInputChange} className = {styles.container__autocomplete} filterOption={(inputValue, option) =>
        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
      }>
      {this.state.allGroups.length > 0 && this.state.allGroups.map(el => {
          return <Option key = {el.group_id} value = {el.group_id} className = {styles.container__options}>
                <div className = {styles.container__groupinfo}> 
                    <div className = {styles.container__header}><p>Name-></p>{el.group_name} </div>
                    <div className = {styles.container__header__id}><p>Id-></p>{el.group_id} </div> 
                    <div> <UsergroupAddOutlined/> </div>  
                </div> 
             </Option> 
      })}
        </AutoComplete>
        <Button type = 'primary' size = 'medium' htmlType = 'submit' className = {styles.container__dropdown__button} onClick = {this.handleJoinGroup} disabled = {this.state.groupId == '' ? true : false}>Join </Button>
        </div>
        <div className = {styles.container__dropdown__error}>{this.state.joinGroupError}</div>
        </>
      )
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
initGroup = () => {
this.setState({toggleGroup: !this.state.toggleGroup});
}
groupInput = () => {
    return(
        <>
        <div className = {`${styles.group__container__icon}`}>
        <PlusCircleOutlined className = {styles.group__icon} onClick = {this.initGroup} />
                    </div>
                    <div className = {`${styles.group__container__form} ${this.state.toggleGroup && styles.toggled} `}>
                    <form>
                <input type = 'text' name = 'group_name' className = {styles.form__input} placeholder = 'Group Name' required />
                <input type = 'text' name = 'group_id' className = {styles.form__input} placeholder = 'Group ID' required/>
                <textarea type = 'text' name = 'group_description' className = {`${styles.form__input} ${styles.textarea}`} placeholder = 'Group Description'></textarea>
                <Button type = 'primary' size = 'medium' htmlType = 'submit' className = {styles.group__button}>Create Group </Button>
                </form>
                </div>
                </>
    )
}

getLocked = () => {
    let {username} = this.props.userData;
    let data = this.props.fullList;
    let arr = [];
    data.forEach((el) => {
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
    let createGroupChat = this.props;
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
        avatar : true,
        myLock : this.state.locked,
        thisicon: (func, param) => { return <CheckCircleOutlined onClick = {func} className = {`${styles.myicon} ${param && styles.toggled}`}/> }
    }
    let pending = {
        avatar : true,
        locked: false,
        favourite: false,
        userData: this.props.userData,
        myLock : this.state.locked,
    }
    let favourite = {
        myUsers : this.props.myUsers,
        avatar : true,  
        locked: true,
        favourite: false,
        setLock :this.setLock,
        userData: this.props.userData,
        myLock : this.state.locked,
    }
    console.log(this.state.joinedGroups);
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
                    return  <Avatar shape = 'circle' size = {55} src = {`/images/${el}--profilepicture.png`} className = {styles.container__avatar} className = {`${styles.avatar}`} />                
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
                        return <Friendrequests {...pending} displayIcon = {()=> false} friendname = {el} setDelete = { () => {this.deletePending(el) }} key = {index} createChat = {() => { this.props.createChat(el)}} avatar = {() => {
                            return  <Avatar shape = 'circle' size = {55} src = {`/images/${el}--profilepicture.png`} className = {styles.container__avatar} className = {`${styles.avatar}`} />                
                                }} />
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
                        return <Friendrequests {...favourite} isLocked = {this.state.locked.indexOf(el) == -1 ? false : true} friendname = {el} createChat = {() => { this.props.createChat(el)}} friendName = {el} setDelete = {() => {this.props.toggleFavourite(el, false) }} avatar = {() => {
                            return  <Avatar shape = 'circle' size = 'large' src = {`/images/${el}--profilepicture.png`} className = {styles.container__avatar} className = {`${styles.avatar}`} />                
                                }} />
                    })}
            </TabPane>
            <TabPane key = "5" tab = {
                <span className = {styles.tab}>
                   <AppleOutlined/> 
                   MyGroups
                </span>
                                    }
            >   
                    <>
<Tabs className = {styles.tab__container}>
    
        <TabPane tab= {<span className = {styles.tab__title}>Join Group </span>} key="1" className = {styles.tab__key}>
                            {this.listGroups()}
        </TabPane>

        <TabPane tab= {<span className = {styles.tab__title}>Create Group </span>} key = '2' className = {styles.tab__key}>
        {this.groupInput()}
        {this.state.loading ? <Spin/> : 
                   this.state.myGroups.map((el, index) => {
                       return <Creategroup createGroupChat = {this.props.createGroupChat} joinedGroups = {false}  key = {index} userData =  {this.props.userData} groupDescription = {el.description} groupName = {el.group_name} groupId = {el.group_id}/>
                   })
                 }
        </TabPane>
        
                <TabPane tab = {<span>All Groups</span>} key = '3'>
                 { this.state.loadJoined ? <Spin/> :  this.state.joinedGroups.map((el, index) => {
                     return <Creategroup createGroupChat = {this.props.createGroupChat} joinedGroups = {true} key = {index} userData =  {this.props.userData} description = {false} groupDescription = {el.description} groupName = {el.group_name} groupId = {el.group_id}/>
                    })
                }
        </TabPane>
      </Tabs>
      </>
            </TabPane>
        </Tabs>
    )
        }
}
export default Friendslist;