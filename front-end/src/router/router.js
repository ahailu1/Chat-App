import React from 'react';
import {Router, BrowserRouter, Switch, Route, Redirect, Link} from 'react-router-dom';
import {Menu} from 'antd';
import Cookies from 'universal-cookie';
import Homepage from '../components/firstpage/homepage';
import Chat from '../components/chatpage/chat';
import io from 'socket.io-client';
import axios from 'axios';
import Navbar from '../components/header/header';
export default class App extends React.Component {  
    constructor(props){
        super(props);
        this.state = {
            userData: null,
            loggedIn: false,
            users: []
        }
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount = () => {
        this.getUsers();
        this.handleAuthentication();
    }

    getUsers = () => {
        axios.get('http://localhost:5000/api/allusers').then(res => {
        let source = {'value': 'anything'};
        let arr = res.data.map((el, index) => {
            //copy object value
            let newKey = el;
            newKey.value = newKey.username;
            //delete object
            delete newKey.username;
            return newKey;
        });
        
       let data = res.data;
      this.setState({users: data});


        }).catch((err) => {

        });

    }
handleLogin = (data) => {
    console.log(data);
    const cookie = new Cookies();
    cookie.set('userData', data);
    this.setState({userData: data, loggedIn: true });
}
handleLogout = () => {
    const cookie = new Cookies();
    let exists = cookie.get('userData');
    let {username} = exists;
    let logout = {
        offline: true,
        username: username
    }
    const socket = io('http://localhost:5000');
    cookie.remove('userData');
    socket.disconnect();
    this.setState(() => {
        return {
            userData: null,
            loggedIn: false
        }
    });
}
handleAuthentication = () => {
    const cookie = new Cookies();
    const userData = cookie.get('userData');
    if(userData !== undefined) {
        let { token, username } = userData;
    axios.get('http://localhost:5000/api/authenticate', {
        headers: {
            Authorization:'Bearer' + token
        }
    })
    .then((res) => {
        this.setState( (prev) => {
            return {
                loggedIn: true,
                userData: userData
            }
        })
    })
    .catch((err) => {
        this.setState( (prev) => {
            return {
                loggedIn: false,
                userData: null
            }
        })
    });
    } else {
        this.setState( (prev) => {
            return {
                loggedIn: false,
                userData: null
            }
        })
    }
}

render(){

const socket = io('http://localhost:5000');
let users = this.state.users;
let {userData} = this.state;
let props = this.state;
return(
    <div>

    <BrowserRouter>
    <Switch>
    <Route exact path = '/' 
    render = { (props) => ( <Homepage {...props} handleLogin = {this.handleLogin} render = {(props) => (
         <Navbar initUser = {false} userData = {this.state.userData} handleLogout = {this.handleLogout} users = {users} render = {(props) => 
             ( <> 
             <Menu.Item key="1"><Link  to = '/'>Home</Link></Menu.Item>
        <Menu.Item key="2"><Link  to = '/chat'>Chat</Link></Menu.Item>
        <Menu.Item key="3">Search</Menu.Item> 
        </>) 
    } />
    )}/> )}
    >
        {this.state.loggedIn == true && <Redirect to ={ `/chat/${this.state.userData.username}`} /> } 
    </Route>
    <Route path = '/chat/:username/:friendslist?/:friendname?' 
    render = {(props) => ( 
    <Chat props = {props} userData = {userData} handleLogout = {this.handleLogout} users = {users}/>
    )}>
    {this.state.loggedIn == false && <Redirect to ={ `/` } /> } 
       
    </Route>

    </Switch>
    </BrowserRouter>
    </div>
    )
  }
}