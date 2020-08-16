import React from 'react';
import ReactDOM from 'react-dom';
import {Router, BrowserRouter, Switch, Route, history, withRouter, Redirect} from 'react-router-dom';
import Cookies from 'universal-cookie';
import Homepage from '../components/firstpage/homepage';
import Header from '../components/header/header';
import Chat from '../components/chatpage/chat';
import {UserProvider} from '../components/context';
import io from 'socket.io-client';
import axios from 'axios';
export default class App extends React.Component {  
    constructor(props){
        super(props);
        this.state = {
            userData: null,
            loggedIn: false
        }
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    componentDidMount = () => {
        this.handleAuthentication();
    }
handleLogin = (data) => {
    console.log(data);
    const cookie = new Cookies();
    cookie.set('userData', data);
    this.setState({userData: data, loggedIn: true });
}
handleLogout = () => {
    const cookie = new Cookies();
    cookie.remove('userData');
    let exists = cookie.get('userData');
    console.log(exists);
    this.setState(() => {
        return {
            userData: null,
            loggedIn: false
        }
    })
}
handleAuthentication = () => {
    const cookie = new Cookies();
    const userData = cookie.get('userData');
    console.log(userData);
    if(userData !== undefined) {
        let { token, username } = userData;
    axios.get('http://localhost:5000/api/authenticate', {
        headers: {
            Authorization:'Bearer' + token
        }
    })
    .then((res) => {
        console.log(res.status);
        console.log(this.state.userData);
        console.log(userData);
      if(res.status == 200) {
        console.log(userData);
        console.log(userData + 'hello');
        console.log(username);
        this.setState( (prev) => {
            return {
                loggedIn: true,
                userData: userData
            }
        })
      } else {
        this.setState( (prev) => {
            return {
                loggedIn: false,
                userData: null
            }
        })
    }  
    })
    .catch((err) => {
    
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
return(
    <div>

    <BrowserRouter>
    <Header userData = {this.state.userData} handleLogout = {this.handleLogout} />
    <Switch>
    <Route exact path = '/' 
    render = { (props) => ( <Homepage {...props} handleLogin = {this.handleLogin}/> ) }
    >
        {this.state.loggedIn == true && <Redirect to ={ `/chat/${this.state.userData.username}`} /> } 
    </Route>
    <Route path = '/chat/:username/:friendslist?/:friendname?' 
    render = {(props) => (
    <Chat {...props}/>
    )}>
    {this.state.loggedIn == false && <Redirect to ={ `/` } /> } 
       
    </Route>

    </Switch>
    </BrowserRouter>
    </div>
    )
  }
}