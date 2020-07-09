import React, {useState} from 'react';
import styles from './friendrequests.module.scss'
import { MessageFilled , DeleteFilled,LockFilled } from '@ant-design/icons';
import {Button} from 'antd';
const Friendrequest = (props) => {
const [state, myfunc] = useState(false);

const toggle = () => {
    console.log(state);
    myfunc(true);
}
const toggleOff = () => {
    myfunc(false);
}
    return(
        <div className = {styles.container}>

            <div className = {styles.container__username}>{props.username}</div>

            <div className = {styles.container__icon}>
            
            <div className = {styles.icon} ><MessageFilled/></div>
            <div className = {styles.icon}> <LockFilled/></div>
                <div className = {`${styles.icon} ${state && styles.toggled}`}> 
                <DeleteFilled onClick = {toggle} className = {styles.ok}/>
              
                { state && 
               <div className = {styles.container__button}>
               <Button type = 'default' size = 'small' className = {styles.button}>Yes</Button>
               <Button type = 'default' size = 'small' onClick = {toggleOff}>No</Button>
                </div>
                } 

                        </div>
            </div>
          
        </div>
    )
}

export default Friendrequest