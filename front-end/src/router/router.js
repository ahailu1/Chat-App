import React from 'react';
import ReactDOM from 'react-dom';
import {Router, BrowserRouter, Switch, Route} from 'react-router-dom';
import Homepage from '../components/firstpage/homepage';
import Header from '../components/header/header';
import Chat from '../components/chatpage/chat';
export default class App extends React.Component {  
    constructor(props){
        super(props);
    }

render(){

return(
    <div>
    <BrowserRouter>
    <Header />
    <Switch>
    <Route exact path = '/' 
    render = {() => (<Homepage/>) }
    />
    <Route exact path = '/chat' 
    render = {() => (<Chat/>) }
    />
    </Switch>
    </BrowserRouter>
    </div>
    )
  }
}