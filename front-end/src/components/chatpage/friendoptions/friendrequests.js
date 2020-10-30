import React, {useState, useEffect} from 'react';
import styles from './friendrequests.module.scss'
import { MessageFilled , DeleteFilled,LockFilled } from '@ant-design/icons';
import {Button} from 'antd';
import axios from 'axios';

const Friendrequest = (props) => {
    const [globalVar] = useState('https://instachatter.com');
    const [msgLock, msgOn] = useState(false);
    const [lock, lockOn] = useState(false);
const [star, favouriteOn] = useState(false);
const [trash, trashOn] = useState(false);
const [error, passwordOn] = useState('');
const [turnOff, toggleAny] = useState([]);
    const [chat, toggleChatIcon] = useState(false);
const [isSet, setPass] = useState(false);
const toggleTrash = (e) => {
    trashOn(!trash);
};

const toggleFavourite = (e) => {
    let val = e.currentTarget.id;
    favouriteOn(!star);
};
const toggleLock = (e) => { 

    if(turnOff.length === 0){
        toggleAny(['favourites', 'chat', 'trash']);
        lockOn(true);
        } else {
            lockOn(false);

            toggleAny([]);
        }
};

const deleteFunction = () => {
    props.setDelete();
    toggleTrash();
}
const myChat = () => {
    if(props.myLock.indexOf(props.friendname) !== -1){
    msgOn(!msgLock);
    if(turnOff.length === 0){
    toggleAny(['favourites', 'lock', 'trash']);
    } else {
        toggleAny([]);
    }
    } else {
    props.createChat(props.friendname);
    toggleChatIcon(true);
    }
}
const toggleMessage = () => {
    msgOn(!msgLock);
}
const loginChat = (e, friendname) => {
    e.preventDefault();
    let query;
    if(props.myUsers.indexOf(friendname) !== -1){
        query = 1;
} else {
    query = 2;
}    
    let {username} = props.userData;
    let val = e.target.loginpwd.value;
    let config = {
        method: 'POST',
        url: `${globalVar}/chat/friendslist/unlock`,
        data: {
        username: username,
        friendname: friendname,
        query: query,
        password: val,
        },
    }
    axios(config).then(res => {
        props.createChat(props.friendname);
        msgOn(!msgLock);
        toggleChatIcon(true);
        toggleAny([]);
    }).catch(err => {
    })

}
let removeLock = (e, callback, friendname) => {
    e.preventDefault();
    let {username} = props.userData;
    let password = e.target.removepwd.value;
    let query;
    if(props.myUsers.indexOf(friendname) !== -1){
        query = 1
    } else {
        query = 2
    };
    console.log(password);
    let config = {
        method: 'PUT',
        url: `${globalVar}/chat/friendslist/removelock`,
        data: {
            username:username,
            password:password,
            friendname: friendname,
            query: query
        }
    }
    axios(config).then(el => {
        callback(friendname);
    }).then(el => {

    }).catch(el => {
        console.log(el.response)
    });
};

const handleLock = (e,callback, friendname, rmvlock = false) => {
    e.preventDefault();
    let mypass;
    let myparam;
    let thisMethod;
    let query;
    let setpass;
    let {username} = props.userData;
    let confirmpass;
    if(props.myUsers.indexOf(friendname) !== -1){
            query = 1;
    } else {
        query = 2;
    }
        if(rmvlock){
            setpass = e.target.removepwd.value;
            myparam = 'removelock';
            thisMethod = 'put';
        } else {
             setpass = e.target.setpass.value;
            confirmpass = e.target.confirmpass.value;        
            mypass = setpass;
            myparam = 'setlock';
            thisMethod = 'post';
        }
        let userInfo = {
            method: `${thisMethod}`,
            url: `${globalVar}/chat/friendslist/${myparam}/`,
            data: {
                username: username,
                password: setpass,
                friendname: friendname,
                query: query, 
            }
        };
        if((!rmvlock && setpass === confirmpass && setpass !== '') || rmvlock == true ){
        axios(userInfo).then(el => {
            console.log(friendname);
            setPass(!isSet);
            toggleAny([]);
            lockOn(false);
         callback(friendname);
        })
        .then(newData => {
        })
        .catch(el => {
            let err = el.response.data.errormsg;
            console.log(err);
            passwordOn('couldnt lock chat: error. Try again');

        })
    } else {
        passwordOn('passwords do not match');
    }
}
    return(

        <div className = {styles.container}>
            <div className = {`${styles.container__username}`}>
                {props.avatar !== false && props.avatar()}
                {props.friendname}
                </div>

            <div className = {styles.container__icon}>
            
            <div className = {`${styles.chaticon__container} ${msgLock && styles.toggled} ${turnOff.indexOf('chat') != -1 && styles.toggled__off}`}>
            <MessageFilled onClick = {myChat} className = {`${styles.chaticon} ${chat && styles.toggled}`}/>
            
            {msgLock &&
            <form method = 'post' onSubmit = { (e) => {loginChat(e, props.friendname)} }>                        
                         <div className = {styles.confirm}>
                         <input name = 'loginpwd' type = 'password' placeholder = 'Set Password' className = {styles.input__password} />
                         </div>
                         <div className = {`${styles.container__button}`}>
                        <Button htmlType = 'submit' type= "default" size = 'small' className = {styles.button}>Chat </Button>
                        <Button type = 'default' size = 'small' className = {styles.button} onClick = {myChat}>Cancel</Button>
                        </div>
                        </form>
            }
                        </div>

        {props.favourite &&

    <div className = {`${styles.container__icon__alternative} ${chat && styles.toggled} ${turnOff.indexOf('favourites') != -1 && styles.toggled__off} `}>
        {props.thisicon(toggleFavourite, star)}

               <div className = {`${styles.container__button__favourite} ${star && styles.toggled}`}>
                   <div className = {styles.confirm}> Confirm </div>
                   <div className = {`${styles.container__button}`}>
               <Button type = 'default' size = 'small' className = {styles.button} onClick = {() => {props.setFunction(props.friendname, true); favouriteOn(!star)}}>Yes</Button>
               <Button type = 'default' size = 'small' className = {styles.button} onClick = {toggleFavourite}>No</Button>
                </div>
                </div>
     </div>
     }
                    {props.locked && 
                         <div className = {`${styles.container__icon__lock} ${lock && styles.toggled} ${turnOff.indexOf('lock') != -1 && styles.toggled__off} `} > 
                  
                  <LockFilled className = {`${styles.myicon} ${props.isLocked && styles.highlighted}` } onClick = {toggleLock}/>
         
                       <div className = {`${styles.container__button__lock} ${lock && styles.toggled}`}>
                       {!props.isLocked &&
                        <form method = 'post' className = {`${isSet && styles.isset}`} onSubmit = { (e) => {handleLock(e, props.setLock, props.friendname, false)} }>                        
                         <div className = {`${styles.confirm}`}>
                         <input name = 'setpass' id = 'mypass' type = 'password' placeholder = 'Enter Password' className = {styles.input__password} required />
                         <input name = 'confirmpass' type = 'password' placeholder = 'Confirm' className = {styles.input__password} required />
                            <p>{error}</p>
                         </div>
                         <div className = {`${styles.container__button}`}>
                        <Button htmlType = 'submit' type= "default" size = 'small' className = {styles.button}>Set </Button>
                        <Button type = 'default' size = 'small' className = {styles.button} onClick = {toggleLock}>Cancel</Button>
                        </div>
                        </form>
                        }
                        
                        {props.isLocked &&
                            <form method = 'post' onSubmit = { (e) => {handleLock(e,props.deleteLock, props.friendname, true)} }>                        
                            <div className = {`${styles.confirm}`}>
                            <input name = 'removepwd' id = 'mypass' type = 'password' placeholder = 'Remove Password' className = {styles.input__password} required />
                               <p>{error}</p>
                            </div>
                            <div className = {`${styles.container__button}`}>
                           <Button htmlType = 'submit' type= "default" size = 'small' className = {styles.button}>Remove </Button>
                           <Button type = 'default' size = 'small' className = {styles.button} onClick = {toggleLock}>Cancel</Button>
                           </div>
                           </form>
                        }
                         </div>
                     
         
                                 </div>
                    }

                <div className = {`${styles.container__icon__trash} ${turnOff.indexOf('trash') != -1 && styles.toggled__off}`}> 
                  
                <DeleteFilled className = {`${styles.myicon} ${trash && styles.toggled}`} onClick = {toggleTrash}/>

               <div className = {`${styles.container__button__trash} ${trash && styles.toggled}`}>
                <div className = {styles.confirm}>Confirm</div>
                <div className = {styles.container__button}>
               <Button type = 'default' size = 'small' className = {styles.button} onClick = {deleteFunction}>Yes</Button>
               <Button type = 'default' size = 'small' className = {styles.button} onClick = {toggleTrash}>No</Button>
               </div>
                </div>
            

                        </div>
            </div>
          
        </div>
    )
}

export default Friendrequest