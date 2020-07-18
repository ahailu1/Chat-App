import React, {useState} from 'react';
import styles from './friendrequests.module.scss'
import { MessageFilled , DeleteFilled,LockFilled } from '@ant-design/icons';
import {Button} from 'antd';
const Friendrequest = (props) => {
const [state, myfunc] = useState(false);
const [icon, toggleIcon] = useState(false);
const toggle = () => {
    console.log(state);
    myfunc(true);
};
const toggleOff = () => {
    myfunc(false);
};

const iconOn = () => {
    console.log(state);
    toggleIcon(!icon);
};
const iconOff = () => {
    toggleIcon(false);
};

    return(
        <div className = {styles.container}>

            <div className = {styles.container__username}>{props.friendname}</div>

            <div className = {styles.container__icon}>
            
            <div className = {styles.icon} onClick = {props.createChat} ><MessageFilled/></div>

    <div className = {`${styles.container__icon__alternative} ${icon && styles.toggled}`} onClick ={iconOn}>
        <span className = {`${styles.container__icon__istoggled} ${icon && styles.toggled}`}>
        {props.displayIcon}
        </span>
               <div className = {`${styles.container__button__alternative} ${icon && styles.toggled}`}>
                   <div className = {styles.confirm}> Confirm </div>
                   <div className = {styles.container__button__alternative__display}>
               <Button type = 'default' size = 'small' className = {styles.button__alternative} onClick = { props.myFunc}>Yes</Button>
               <Button type = 'default' size = 'small' className = {styles.button__alternative} onClick = {toggleOff}>No</Button>
                </div>
                </div>
     </div>

                <div className = {`${styles.icon__delete} ${state && styles.toggled}`}> 
                  
                <DeleteFilled onClick = {toggle} className = {styles.icon__delete}/>
            
               <div className = {`${styles.container__button} ${state && styles.toggled}`}>
               <Button type = 'default' size = 'small' className = {styles.button} onClick = { props.myFunc}>Yes</Button>
               <Button type = 'default' size = 'small' onClick = {toggleOff}>No</Button>
                </div>
            

                        </div>
            </div>
          
        </div>
    )
}

export default Friendrequest