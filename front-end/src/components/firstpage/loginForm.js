import React from 'react';
import {Row, Col, Form, Input, Button} from 'antd';
import styles from './Loginform.module.scss';
import axios from 'axios';
class Loginform extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name: null,
    
        }
    }
    userInput = (e) => {
        let item = e.target.name;
        console.log(item);
        }
        
        handleForm = async (e) => {
          e.preventDefault();
        const data = {
            method: 'POST',
            url: 'http://localhost:5000/',
            data: {
            username: e.target.username.value,
            password: e.target.password.value,
            },
        }
        const request = await axios(data);
        console.log(request);
        }

    render(){
        return(
        <div className = {styles.container}>
        <div className = {styles.container__header}>LOGIN</div>
    <form method = 'POST' onSubmit = {this.handleForm}>
        <div className = {styles.container__username}>
        <input type = 'text' name = 'username' placeholder = 'username' className = {styles.input__username} onChange = {this.handleInput} value = {this.state.name}/>
        
        </div>
        <div className = {styles.container__password}>
        <input type = 'text' name = 'password' placeholder = 'password' className = {styles.input__password} onChange = {this.handleInput} value = {this.state.name}/>
        </div>
        <div className = {styles.container__password}>
        <Button type = "primary" htmlType="submit">Login</Button>
        </div>
    </form>
</div>
    )
}

}

export default Loginform;