import React from 'react';
import {Row, Col, Form, Input, Button} from 'antd';
import styles from './Loginform.module.scss';
import axios from 'axios';
import Cookies from 'universal-cookie';
import {history, withRouter} from 'react-router-dom';
class Loginform extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name: null,
    
        }
    }
    userInput = (e) => {
        let item = e.target.name;
        }
        
        handleForm = async (e) => {
          e.preventDefault();
        const data = {
            method: 'POST',
            url: 'http://localhost:5000/api/loginuser',
            data: {
                login__user: true,
            username__login: e.target.username.value,
            password__login: e.target.password.value,
            },
        }
        const request = await axios(data);

        if(request.status == 200){
            let data = request.data;
            console.log(data);   
            this.props.handleLogin(data);
            this.props.history.push(`/chat/${request.data.username}`);

        } else {
        }
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

export default withRouter(Loginform);