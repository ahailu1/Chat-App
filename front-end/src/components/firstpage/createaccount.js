import React from 'react';
import styles from './createaccount.module.scss';
import {Spin, Button} from 'antd';
import axios from 'axios';
import {history, withRouter} from 'react-router-dom';

class Createaccount extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            name: null,
            errUsername: [],
            errPassword: [],
            errConfirmPwd: [],
            loading: null,
            globalVar : "https://instachatter.com",

            
        }
    }

    loadForm = () => {
        return (
            <>
            <div className = {styles.container__header}>Create Account</div>
            <form method = 'POST' onSubmit = {this.handleForm}>
                <div className = {styles.container__username}>
                <input type = 'text' name = 'username' placeholder = 'username' className = {styles.input__username} onChange = {this.handleInput} value = {this.state.name}/>
                <div className = {styles.error__input}>{this.state.errUsername.length > 0 && this.state.errUsername.map(el => {return el}) } </div>
                </div>
                <div className = {styles.container__password}>
                <input type = 'password' name = 'password' placeholder = 'password' className = {styles.input__password} onChange = {this.handleInput} value = {this.state.name}/>
                <div className = {styles.error__input}>{this.state.errPassword.length > 0 && this.state.errPassword.map(el => {return el}) } </div>
        
                </div>
                <div className = {styles.container__password}>
                <input type = 'password' name = 'confirm__password' placeholder = 'confirm' className = {styles.input__password} onChange = {this.handleInput} value = {this.state.name}/>
                    <div className = {styles.error__input}>{this.state.errConfirmPwd.length > 0 && this.state.errConfirmPwd.map(el => {return el}) } </div>
                </div>
                <div className = {styles.container__password}>
                <Button type = "primary" htmlType="submit">Login</Button>
                </div>
            </form>
            </>
        )
    }
    handleInput = (e) => {
        let item = e.target.name;
        let value = e.target.value;
        this.setState((prev) => {
            return {
                [item] : value
            }
        })
        }
        
        handleForm =  (e) => {
          e.preventDefault();
        const data = {
            method: 'POST',
            url: `${this.state.globalVar}/api/createaccount`,
            data: {
            username: e.target.username.value,
            password: e.target.password.value,
            confirm__password: e.target.confirm__password.value,
            },
        }
         axios(data).then(res => {
             this.props.handleLogin(res.data);
            this.props.history.push(`/chat/${res.data.username}`);
         }).catch(err => {
        
             let error = err.response.data.isValidated.data;
             let [errUsername, errPassword, errConfirmPwd]= [[], [], []];
                error.map((el) => {
                if(el.param == 'username'){
                   errUsername = errUsername.concat(el.msg)
                } else if (el.param == 'password'){
                    errPassword = errPassword.concat(el.msg);
                } else if (el.param == 'confirm__password'){
                    errConfirmPwd = errConfirmPwd.concat(el.msg);
                }
            })
            this.setState({errConfirmPwd, errUsername, errPassword})
    
         })        
        }

render(){
    return(
  <div className = {styles.container}>
             {this.state.loading ? <Spin size = 'large' tip = 'logging in'/> : this.loadForm()}

</div>
    )
}

}

export default withRouter(Createaccount);