import React from 'react';
import {Row, Col, Form, Input, Button, Layout, Avatar, Upload} from 'antd';
import styles from './profilepicture.module.scss';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';

class Profilepicture extends React.Component{
constructor(props){
super(props);
this.loadProfile = this.loadProfile.bind(this);

this.state = {
    profilepic: null,
    image: null,
    fileList: [
      {
        uid: '',
        name: '',
        status: '',
        url: '',
      },
    ],
  };
}
componentDidMount = () => {
  this.loadProfile();
}

loadProfile = async () => {
  let {username, token} = this.props.userData;
  console.log('got em');
  let getPic = await axios.get(`http://localhost:5000/chat/${username}`, {
    headers: {
      Authorization:'Bearer' + token,
    }
  });
  const data = getPic.data;
console.log(getPic.status);
if(getPic.status == 200) {
  this.setState({profilepic: data});
  } else {
    this.setState({profilepic: null});
  }  
}

handleChange = async (info) => {
    const formData = new FormData();
    formData.append('avatar', info);
    let {username} = this.props.userData;
        const fetchRes = await axios.post(`http://localhost:5000/chat/${username}`,formData);
    const data =  fetchRes.data;
    const newBlob = new Blob([data],{type: 'image/png'});
    const image = `data:image/png;base64,${data}`;
    this.setState({profilepic:image});
}

render(){
    return(
        <div className = {styles.container__profile}> 
        <Avatar size = {150} className = {styles.avatar} src = {`${this.state.profilepic == null ? '/images/default--profilepicture.png' : this.state.profilepic}`} />
    <Upload name = 'avatar' action = {this.handleChange}> 
    <Button size = "large" className = {styles.upload__button}>
    <UploadOutlined />Upload
    </Button>
    </Upload>
     </div>
    )

}

}

export default Profilepicture;
