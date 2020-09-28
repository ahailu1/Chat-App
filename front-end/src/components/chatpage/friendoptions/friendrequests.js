import React, {useState, useEffect} from 'react';
import styles from './friendrequests.module.scss'
import { MessageFilled , DeleteFilled,LockFilled, StarFilled } from '@ant-design/icons';
import {Button} from 'antd';
import axios from 'axios';

const Friendrequest = (props) => {
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
    console.log(val);
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
        url: 'http://localhost:5000/chat/friendslist/unlock',
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
        console.log(err.message);
    })

}

const handleLock = (e,callback, friendname) => {
    e.preventDefault();
    let mypass = e.target.setpass.value;
    let confirm = e.target.confirmpass.value;
    let query;
    if(props.myUsers.indexOf(friendname) !== -1){
            query = 1;
    } else {
        query = 2;
    }
    if(mypass === confirm){
        passwordOn('');
        let {username} = props.userData;
        let userInfo = {
            method: 'POST',
            url: `http://localhost:5000/chat/friendslist/setlock/`,
            data: {
                username: username,
                password: mypass,
                friendname: friendname,
                query: query, 
            }
        }
        axios(userInfo).then(el => {
         callback(friendname);
        })
        .then(newData => {
            setPass(!isSet);
            toggleAny([]);
            lockOn(false);
        })
        .catch(el => {
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
                        <form method = 'post' className = {`${isSet && styles.isset}`} onSubmit = { (e) => {handleLock(e, props.setLock, props.friendname)} }>                        
                         <div className = {`${styles.confirm}`}>
                         <input name = 'setpass' id = 'mypass' type = 'password' placeholder = 'Set Password' className = {styles.input__password} required />
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
                            <form method = 'post' onSubmit = { (e) => {handleLock(e, props.setLock, props.friendname)} }>                        
                            <div className = {`${styles.confirm}`}>
                            <input name = 'setpass' id = 'mypass' type = 'password' placeholder = 'Remove Password' className = {styles.input__password} required />
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