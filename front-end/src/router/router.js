import React from 'react';
import ReactDOM from 'react-dom';
import {Router, BrowserRouter, Switch, Route, history} from 'react-router-dom';
import Cookies from 'universal-cookie';
import Homepage from '../components/firstpage/homepage';
import Header from '../components/header/header';
import Chat from '../components/chatpage/chat';
import {UserProvider} from '../components/context';
import io from 'socket.io-client';

export default class App extends React.Component {  
    constructor(props){
        super(props);

        this.handleLogin = this.handleLogin.bind(this);
    }

handleLogin = (data) => {
    console.log(data);
    const cookie = new Cookies();
    cookie.set('userData', data);

}



render(){

const socket = io('http://localhost:5000');
return(
    <div>

    <BrowserRouter>
    <Header />
    <Switch>
    <Route exact path = '/' 
    render = { (props) => ( <Homepage {...props} handleLogin = {this.handleLogin}/> ) }
    />
    <Route path = '/chat/:username/:friendslist?/:friendname?' 
    render = {(props) => (
        <UserProvider value = {socket}>
    <Chat {...props}/>
    </UserProvider>
    )} />

    </Switch>
    </BrowserRouter>
    </div>
    )
  }
}