import React, {useState, useEffect} from 'react';
import styles from './friendrequests.module.scss'
import { MessageFilled , DeleteFilled,LockFilled } from '@ant-design/icons';
import {Button} from 'antd';



const Friendrequest = (props) => {
    const [state, myfunc] = useState(false);
const [icon, toggleIcon] = useState(false);
    const [chat, toggleChat] = useState(false);
const [online, isOnline] = useState([]); 

useEffect(() => {
const list = props.loggedIn;
isOnline(list);
console.log(list);
}, [online])

    const toggle = () => {
    console.log(state);
    myfunc(!state);
};
const toggleOff = () => {
    myfunc(false);
};

const toggleOnline = (props) => {

}

const myContainer = () => {
    let {loggedIn, friendname, ...props} = props;


}

const iconOn = () => {
    console.log(state);
    toggleIcon(!icon);
};
const iconOff = () => {
    toggleIcon(false);
};

const myChat = () => {
    toggleChat(!chat);
    props.createChat();
}
    return(

        <div className = {styles.container}>
            <div className = {`${styles.container__username}`}>
                {props.avatar !== false && props.avatar()}
                {props.friendname}
                </div>

            <div className = {styles.container__icon}>
            
            <div className = {`${styles.icon} ${chat && styles.toggled} `} onClick = {myChat} ><MessageFilled/></div>

    <div className = {`${styles.container__icon__alternative} `} onClick ={iconOn}>
        <span className = {`${styles.container__icon__istoggled} ${icon && styles.toggled}`}>
        {props.displayIcon}
        </span>
               <div className = {`${styles.container__button__alternative} ${icon && styles.toggled}`}>
                   <div className = {styles.confirm}> Confirm </div>
                   <div className = {styles.container__button__alternative__display}>
               <Button type = 'default' size = 'small' className = {styles.button__alternative} onClick = { props.myFunc}>Yes</Button>
               <Button type = 'default' size = 'small' className = {styles.button__alternative} onClick = {iconOff}>No</Button>
                </div>
                </div>
     </div>

                <div className = {`${styles.container__button__delete} ${state && styles.toggled}`}  onClick = {toggle}> 
                  
                <DeleteFilled className = {`${styles.icon__delete} ${state && styles.toggled}`}/>

               <div className = {`${styles.container__button} ${state && styles.toggled}`}>
                <div className = {styles.confirm}>Confirm</div>
                <div className = {styles.container__button__delete__display}>
               <Button type = 'default' size = 'small' className = {styles.button} onClick = { props.myFunc}>Yes</Button>
               <Button type = 'default' size = 'small' className = {styles.button} onClick = {toggleOff}>No</Button>
               </div>
                </div>
            

                        </div>
            </div>
          
        </div>
    )
}

export default Friendrequest