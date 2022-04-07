import React, {useState} from 'react';
import { DeleteFilled,LockFilled } from '@ant-design/icons';
import {Button} from 'antd';
import styles from './displaypending.module.scss';
const DisplayPending = (props) => {

    const [variable, setVariable] = useState(false);

    const toggleOn = () => {
        setVariable(!variable);
    }

    return(
        <div className = {styles.container}>

        <div className = {styles.container__friendname}>
            <h1>{props.friendname}</h1>
        <DeleteFilled onClick = {toggleOn}/>
        </div>
       {variable && <div className = {styles.container__button}> 
        <Button type = 'default' size = 'small' className = {styles.button} onClick = {() => { props.deletePending(props.friendname); setVariable(false)}}>Yes</Button>
        <Button type = 'default' size = 'small' className = {styles.button} onClick = {toggleOn}>no</Button>
        </div>}
    {variable &&      
        <div className = {styles.container__button}> 
        <Button type = 'default' size = 'small' className = {styles.button} onClick = {() => { props.deletePending(props.friendname); setVariable(false)}}>Yes</Button>
        <Button type = 'default' size = 'small' className = {styles.button} onClick = {toggleOn}>no</Button>
        </div>
    }
    </div>
    )
}

export default DisplayPending;