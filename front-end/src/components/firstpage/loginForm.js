import React from 'react';
import { Button, Spin} from 'antd';
import styles from './Loginform.module.scss';
import axios from 'axios';
import Cookies from 'universal-cookie';
import {history, withRouter} from 'react-router-dom';
class Loginform extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name: null,
            loading: null,
            error: '',

        }
    }
    userInput = (e) => {
        let item = e.target.name;
        }
        
        handleForm = (e) => {
          e.preventDefault();
          this.setState({loading: true, error: ''});
        const data = {
            method: 'POST',
            url: `${process.env.REACT_APP_CHAT_URL}/api/loginuser`,
            data: {
                login__user: true,
            username__login: e.target.username.value,
            password__login: e.target.password.value,
            },
        };
        axios(data).then(res => {
            this.setState({loading: false});
            let {data} = res;
            this.props.handleLogin(data);
            this.props.history.push(`/chat/${data.username}`);
        }).catch((e) => {
            let {error} = e.response.data.error;
            console.log(e.response.data.error.error);
            this.setState({loading: false, error: error});

        })
        }
loginForm = () => {
    return (
        <>
        <div className = {styles.container__header}>LOGIN</div>
        <form method = 'POST' onSubmit = {this.handleForm}>
            <div className = {styles.container__username}>
            <input type = 'text' name = 'username' placeholder = 'username' className = {styles.input__username} onChange = {this.handleInput} value = {this.state.name}/>
            
            </div>
            <div className = {styles.container__password}>
            <input type = 'password' name = 'password' placeholder = 'password' className = {styles.input__password} onChange = {this.handleInput} value = {this.state.name}/>
            <p>{this.state.error !== '' && this.state.error }</p>
            </div>
            <div className = {styles.container__button}>
            <Button type = "primary" htmlType="submit">Login</Button>
            </div>
        </form>
        </>
    )
}

    render(){
        return(
        <div className = {styles.container}>
       {this.state.loading ? <Spin size = 'large' tip = 'logging in'/> : this.loginForm()}
</div>
    )
}

}

export default withRouter(Loginform);