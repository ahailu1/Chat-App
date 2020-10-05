import React from 'react';
import {Button, Tabs, Avatar, Spin, AutoComplete, Select} from 'antd';
import { AppleOutlined,UserAddOutlined,StarFilled, CheckCircleOutlined, PlusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import styles from './friendslist.module.scss';
import axios from 'axios';
import Friendrequests from './friendoptions/friendrequests';
import Creategroup from './friendoptions/creategroup';
class Friendslist extends React.Component{
constructor(props){
    super(props);
    this.state = {
        locked: [],
        error: '',
        myGroups: [],
        allGroups : [],
        joinedGroups: [],
        loading: null,
        toggleGroup: false,
        groupId : '',
        loadJoined: null,
        joinGroupError: '',
        friendName : '',
        addError: '',
        membersOnly: [],
        createError: '',
        group_id: '',
        group_name: '',
        group_description: '',
    }
    this.setLock = this.setLock.bind(this);
    this.deletePending = this.deletePending.bind(this); 
    this.deleteFriend = this.deleteFriend.bind(this);
    this.removeLock = this.removeLock.bind(this);
}
componentDidMount = () => {
    this.getLocked();
    this.getmyGroup();
    this.fetchAllGroups();
    this.getJoinedGroups();
}
handleFriendInput = (e) => {
    let friendname = e;
   this.setState({friendName: friendname, addError: '' });    
}
handleFilter = () => {
    const { Option } = Select;
    let {users,friends, requests, pending, declined} = this.props;
      return (
          <>
        <div className = {styles.container__autocomplete}>
        <AutoComplete icon = {<UploadOutlined/>} placeholder="Search users" onChange = {this.handleFriendInput} className = {styles.container__users} filterOption={(inputValue, option) =>
          option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}>
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
             return <Option key = {el.value}> <div className = {styles.container__options}><div className = {styles.container__username}>{el.value}</div><div className = {styles.container__icon}><UserAddOutlined/></div> </div></Option>
            }

            
                }) }
          </AutoComplete>
                  <Button type = 'primary' size = 'medium' htmlType = 'submit' className = {styles.container__autocomplete__button} onClick = {this.handleAdd} disabled = {this.state.friendName == '' ? true : false}>Add Friend</Button>
        </div>
        <p className = {styles.adderror}>{this.state.addError}</p>
        </>
        )
}

handleAdd = () => {
    let friendName = this.state.friendName;
    let val = false
this.props.users.map(el => {
    if(el.value === friendName){
        val = true;
    }
});
if(val){
    this.props.addFriend(friendName)
    this.setState({addError: 'friend Added', friendName: ''})
} else {
    this.setState({addError: 'please enter an existing username'})
}
}

fetchAllGroups = () => {
    axios.get('https://instachatter.com/chat/groups/allgroups').then(el => {
    let groupMemberName = el.data.map((el) => {
        el = el.group_id;
        return el;
    });
    this.setState({allGroups: el.data, membersOnly: groupMemberName});
    }).catch(el => {

    })
}
getmyGroup = () => {
    let {username} = this.props.userData;
    axios.get(`https://instachatter.com/chat/groups/mygroups/${username}`).then(res => {
        let groupInfo = res.data.groupData;
    this.setState({myGroups: groupInfo, loading: false});
    }).catch(res => {
        this.setState({loading: false});

    })
}

getJoinedGroups = () => {

    this.setState({loadJoined: true});

    let {username} = this.props.userData;
    axios.get(`https://instachatter.com/chat/groups/joinedgroups/${username}`).then(res => {
        let groupInfo = res.data;
    this.setState({joinedGroups: groupInfo, loadJoined: false});
    }).catch(res => {
        this.setState({loadJoined: false});
    })
}
leaveGroup = (username,groupId) => {   
   axios.get(`https://instachatter.com/chat/groups/leavegroup/${groupId}/${username}`)
    .then(res => {
            this.setState((prev) => {
        let filteredGroups = prev.joinedGroups;
        filteredGroups = filteredGroups.filter(el => {
            return el.group_id != groupId
        });
        return {
            joinedGroups: filteredGroups
        }
    })
    })
    .catch(el => {

    })
}
deleteGroup = (username,groupId) => {   
   axios.get(`https://instachatter.com/chat/groups/deletegroup/${groupId}/${username}`)
    .then(res => {
            this.setState((prev) => {
        let filterMyGroups = prev.myGroups;
        let filterJoined = prev.joinedGroups;
        let filterAll = prev.allGroups;

        filterMyGroups = filterMyGroups.filter(el => {
            return el.group_id != groupId
        });
        filterAll = filterAll.filter(el => {
            return el.group_id != groupId
        });
        filterJoined = filterJoined.filter(el => {
            return el.group_id != groupId
        });
        return {
            myGroups: filterMyGroups,
            joinedGroups: filterJoined,
            allGroups : filterAll,
        }
    })
    })
    .catch(el => {

    })
}

handleInputChange = (e) => {
 let myGroupId = e;
this.setState({groupId: myGroupId,joinGroupError: '' });    
}

handleJoinGroup = () => {
    let { username } = this.props.userData;
    let {groupId, joinedGroups, allGroups, membersOnly} = this.state;
    // check if you are already in group. If you are it will return your group number
    let groupInfo = this.state.joinedGroups.filter((el) => {
        if(el.group_id === groupId){
            return el;
        }
    });
    if(groupInfo.length > 0) {
        this.setState({joinGroupError: 'You have already Joined this group'})
    } else if(membersOnly.indexOf(groupId) === -1) {
        this.setState({joinGroupError: 'Could Not Join Group. Please Enter A Valid Group ID'})
        let blah = allGroups;
        blah.filter(el => {
            return el.group_id !== groupId
        })
        
    } else {
        axios.get(`https://instachatter.com/chat/groups/join/${groupId}/${username}`).then(res => {
       
            this.setState((prev) => {
                //get all groups
                    let myGroup = prev.allGroups;
                    //get my joined groups
                    let myJoinedGroups = prev.joinedGroups;
                    // filter through all groups so that only the id of the group you want to join is returned
                    myGroup = myGroup.filter(el => {
                         return el.group_id === groupId;
                    });
                    
                    // add the filtered groups to your joined groups
                    let finalGroup = myJoinedGroups.concat(myGroup);
                    return {
                        joinedGroups: finalGroup,
                        joinGroupError: 'Group Joined',
                    }
                });
            })
            .catch(err => {
                this.setState({joinGroupError: 'couldnt join group. try again'});
            })
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
        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}>
      {this.state.allGroups.length > 0 && this.state.allGroups.map(el => {
          
          return <Option key = {el.group_id} value = {el.group_id} className = {styles.container__options}>
                <div className = {styles.container__groupinfo}> 
                    <div className = {styles.container__header__name}><p>Name-></p>{el.group_name} </div>
                    <div className = {styles.container__header__id}><p>Id-></p>{el.group_id} </div> 
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
    deleteFriend = (username, friendname) => {
        let query;

        let {myUsers} = this.props;
        if(myUsers.indexOf(friendname) === -1){
            query = 1;
    } else {
        query = 2;
    }
        axios.delete('https://instachatter.com/chat/friendslist/deletefriend', { 
            data: { 
                username:username, friendname:friendname, query: query 
            } 
        })
        .then((el) => {
            this.props.removeFriend(friendname);

                this.setState({deleteMsg: 'friend Deleted'}, () => {
                })
        }).catch(el => {
    
        });
    }
    declineRequest = async (friendname) => {
    const {username} = this.props.userData;
    const request = await axios.get(`https://instachatter.com/chat/friendslist/declinerequest/${username}/${friendname}`);
    this.props.friendStatus();
    }   
    deletePending = async (friendname) => {
        const {username} = this.props.userData;
        const request = await axios.get(`https://instachatter.com/chat/friendslist/deletepending/${username}/${friendname}`).then(() => {
            this.props.friendStatus();
        }).catch((err) => {
            alert('there was a problem');
        })
    }   
    confirmFriend = (friendName) => {
        const {username} = this.props.userData;
        axios.get(`https://instachatter.com/chat/friendslist/confirm/${username}/${friendName}`).then(data => {
                    this.props.friendStatus();
        }).catch(er => {
            alert('friend not addadsaded');
        });
    }

setLock = (friendname) => {
    //take the friendname and set the lock
         this.setState((prev) => {
        let locked = prev.locked;
        locked = locked.concat(friendname);
        return {
            locked: locked
        }
    }, () => {
    });   
}
initGroup = () => {
this.setState({toggleGroup: !this.state.toggleGroup});
}
handleChange = (e, boolean = false) => {
    if(boolean){
        let item = e.target.name;
        let value = '';
        this.setState({[item]: ''});
    } else {let name = e.target.name;
    let value = e.target.value;
    this.setState({[e.target.name]: e.target.value});
    }
}
groupInput = () => {
    return(
        <>
        <div className = {`${styles.group__container__icon}`}>
        <PlusCircleOutlined className = {styles.group__icon} onClick = {this.initGroup} />
                    </div>
                    <div className = {`${styles.group__container__form} ${this.state.toggleGroup && styles.toggled} `}>
                    <form onSubmit = {this.insertGroup} id = 'group__form'>
                <input type = 'text' name = 'group_name' className = {styles.form__input} placeholder = 'Group Name' onChange = {this.handleChange} maxLength = {20} value = {this.state.group_name} required />
                <input type = 'text' name = 'group_id' className = {styles.form__input} placeholder = 'Group ID' onChange = {this.handleChange} value = {this.state.group_id} maxLength = {20} required/>
                <p className = {`${styles.create__error}`}>{this.state.createError}</p>
                <textarea type = 'text' name = 'group_description' className = {`${styles.form__input} ${styles.textarea}`} value = {this.state.group_description} onChange = {this.handleChange} placeholder = 'Group Description'></textarea>
                <Button type = 'primary' size = 'medium' htmlType = 'submit' className = {styles.group__button}>Create Group </Button>
                </form>
                </div>
                </>
    )
}
clearForm = () => {
    document.getElementById('group__form').reset()
}
insertGroup = (e) => {
    e.preventDefault();
    let {username} = this.props.userData;
    let groupName = this.state.group_name;
    let groupId = this.state.group_id;
    let groupDescription = this.state.group_description;
    let {membersOnly} = this.state;
   let data = {
    groupName,
    groupId,
    groupCreator: username,
    groupDescription,
    }
    let data2 = {
        group_name: groupName,
        group_id: groupId,
        description: groupDescription,
    }
let error = "could create group. Please enter unique group ID";
    let regex = /[^A-Za-z0-9_-]/;
    let validValue = regex.test(groupId);
    if(membersOnly.indexOf(groupId) !== -1){
        this.setState({createError: error})
    } else if(validValue){
            this.setState({createError: 'please enter only numbers, letters and underscores .'})
    } else {
    axios.post('https://instachatter.com/chat/groups/creategroup', data).then(el => {
        
        this.setState((prev) => {
            let newGroup = prev.myGroups;
            newGroup = newGroup.concat([data2]);
            return{
                createError: 'Group Created', 
                group_id: '',
                myGroups: newGroup,
                group_id: '',
                group_name: '',
                group_description: ''
            }
        });
}).catch(err => {
    let error = err;
    this.setState({createError: 'there was an error. Please try again'});
})
    }
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
removeLock = (friendname) => {
    this.setState((prev) => {
            let filterLock = prev.locked;
            console.log(friendname + 'ishere');
            console.log(filterLock);
            filterLock = filterLock.filter(el => {
                return el !== friendname
            });
            console.log(filterLock);
            return {
                locked: filterLock
            }
    });
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
        deleteLock : this.removeLock,
        error: this.state.error,
       thisicon: (func, param) => { return <StarFilled className = {`${styles.myicon} ${param && styles.toggled}`} onClick ={func} id = 'star' /> },
    }
    let requests = {
        locked: false,
        favourite: true,
        userData: this.props.userData,
        avatar : true,
        myLock : this.state.locked,
        thisicon: (func, param) => { return <CheckCircleOutlined onClick = {func} className = {`${styles.myicon} ${param && styles.toggled}`}/> },
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
    let joinedGroups = {
        deleteFunc : this.leaveGroup,
        createGroupChat : this.props.createGroupChat,
        joinedGroups : true,
        userData : this.props.userData,
        description : false,
    }
    let myGroups = {
        deleteFunc : this.deleteGroup,
        createGroupChat : this.props.createGroupChat,
        joinedGroups : true,
        userData : this.props.userData,
        description : true,
        joinedGroups : false,
    }
    let {username} = this.props.userData;
    return(
        <Tabs className = {styles.tab__pane__container} defaultActiveKey = '2'>
            <TabPane key = "1" tab = 
            {
                <span className = {styles.tab}>
                   <AppleOutlined/> 
                   Friends
                </span>
            }
            >
                
        {
           this.handleFilter()
        }
            <div className = {styles.container__myfriends}>
                    { this.props.friends.length > 0  && this.props.friends.map((el, index) => {    
                    return <Friendrequests setDelete = {() => {this.deleteFriend(username, el)}} {...friendsList} isLocked = {this.state.locked.indexOf(el) == -1 ? false : true} setFunction = {() => {this.props.toggleFavourite(el, true)}} friendname = {el} key = {index} createChat = { () => { this.props.createChat(el) }} avatar = {() => {
                    return  <Avatar shape = 'circle' size = {55} src = {`/images/${el}--profilepicture.png`} className = {styles.container__avatar} className = {`${styles.avatar}`}>U</Avatar>                
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
                                <div className = {styles.container__requests}>

                    { this.props.requests.map((el, index) => {
                        return <Friendrequests {...requests} setDelete = {() => {this.declineRequest(el); alert('hello')}} setFunction = {() => {this.confirmFriend(el)}} friendname = {el} key = {index} createChat = {() => { this.props.createChat(el)}} avatar = {() => {
                            return  <Avatar shape = 'circle' size = {55} src = {`/images/${el}--profilepicture.png`} className = {styles.container__avatar} className = {`${styles.avatar}`} /> } } /> })
                        }
                        </div>
            </TabPane>
            <TabPane key = "3" tab = {
                <span className = {styles.tab}>
                   <AppleOutlined/> 
                   Pending
                </span>
                            }
                >
                                <div className = {styles.container__requests}>

                    {this.props.pending.map( (el, index) => {
                        return <Friendrequests {...pending} displayIcon = {()=> false} friendname = {el} setDelete = { () => {this.deletePending(el) }} key = {index} createChat = {() => { this.props.createChat(el)}} avatar = {() => {
                            return  <Avatar shape = 'circle' size = {55} src = {`/images/${el}--profilepicture.png`} className = {styles.container__avatar} className = {`${styles.avatar}`}>U </Avatar>                
                                }} />
                    })}
                    </div>
            </TabPane>
            <TabPane key = "4" tab = {
                <span className = {styles.tab}>
                   <AppleOutlined/> 
                   Favorites
                </span>
                            }
                >
                                <div className = {styles.container__requests}>
                    {this.props.favourites.map(el => {
                        return <Friendrequests {...favourite} isLocked = {this.state.locked.indexOf(el) == -1 ? false : true} friendname = {el} createChat = {() => { this.props.createChat(el)}} friendName = {el} setDelete = {() => {this.props.toggleFavourite(el, false) }} avatar = {() => {
                            return  <Avatar shape = 'circle' size = 'large' src = {`/images/${el}--profilepicture.png`} className = {styles.container__avatar} className = {`${styles.avatar}`} />                
                                }} />
                    })}
                    </div>
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
        <div className = {`${styles.container__requests__creategroup} ${this.state.toggleGroup && styles.toggled}`}>
        {this.state.loading ? <Spin/> : 

                   this.state.myGroups.map((el, index) => {
                       return <Creategroup setProfile = {true} {...myGroups} createGroupChat = {this.props.createGroupChat} key = {`${index}/grouponclick`} groupDescription = {el.description} groupName = {el.group_name} groupId = {el.group_id}/>
                   })
                 }
                 </div>
        </TabPane>
                <TabPane tab = {<span className = {styles.tab__title}>All Groups</span>} key = '3'>
            <div className = {styles.container__allgroups}>        
                 { this.state.loadJoined ? <Spin/> :  this.state.joinedGroups.map((el, index) => {
                     return <Creategroup setProfile = {false} {...joinedGroups} key = {index} groupDescription = {el.description} groupName = {el.group_name} groupId = {el.group_id}/>
                    })
                }
            </div>
        </TabPane>

      </Tabs>
      </>
            </TabPane>
        </Tabs>
    )
        }
}
export default Friendslist;