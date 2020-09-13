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
const [turnOff, toggleAny] = useState(false);
    const [chat, toggleChat] = useState(false);
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
    toggleAny(!turnOff);
    let val = e.currentTarget.id;
    toggleChat(false);
    trashOn(false);
    lockOn(!lock);
};

const myChat = () => {
    toggleChat(!chat);
    if(props.myLock.indexOf(props.friendname) !== -1){
    msgOn(!msgLock);
    } else {
    //wait for validation then open it.
    props.createChat(props.friendname);
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
}    let {username} = props.userData;
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
        console.log(res);
    })

}
const handleLock = (e,callback, friendname) => {
    e.preventDefault();
    console.log(props.myUsers);
    let mypass = e.target.setpass.value;
    let confirm = e.target.confirmpass.value;
    console.log(confirm);
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
            toggleAny(!turnOff);
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
            
            <div className = {`${styles.mychaticon} ${chat && styles.toggled} `} ><MessageFilled onClick = {myChat}/>
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

    <div className = {`${styles.container__icon__alternative} ${turnOff && styles.toggled__off} `}>
        {props.thisicon(toggleFavourite, star)}

               <div className = {`${styles.container__button__favourite} ${star && styles.toggled}`}>
                   <div className = {styles.confirm}> Confirm </div>
                   <div className = {`${styles.container__button}`}>
               <Button type = 'default' size = 'small' className = {styles.button} onClick = {() => {props.setFunction(props.friendname, true); favouriteOn(false)}}>Yes</Button>
               <Button type = 'default' size = 'small' className = {styles.button} onClick = {toggleFavourite}>No</Button>
                </div>
                </div>
     </div>
     }
                    {props.locked && 
                         <div className = {`${styles.container__icon__lock} ${lock && styles.toggled} `} > 
                  
                  <LockFilled className = {`${styles.myicon} ${lock && styles.toggled} ${props.isLocked && styles.highlighted}` } onClick = {toggleLock}/>
         
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

                <div className = {`${styles.container__icon__trash} ${turnOff && styles.toggled__off}`}> 
                  
                <DeleteFilled className = {`${styles.myicon} ${trash && styles.toggled}`} onClick = {toggleTrash}/>

               <div className = {`${styles.container__button__trash} ${trash && styles.toggled}`}>
                <div className = {styles.confirm}>Confirm</div>
                <div className = {styles.container__button}>
               <Button type = 'default' size = 'small' className = {styles.button} onClick = { props.setDelete}>Yes</Button>
               <Button type = 'default' size = 'small' className = {styles.button} onClick = {toggleTrash}>No</Button>
               </div>
                </div>
            

                        </div>
            </div>
          
        </div>
    )
}

export default Friendrequest