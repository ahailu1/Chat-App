import React from 'react';
import {Row, Col, Form, Input, Button, Layout, Avatar, Upload} from 'antd';
import styles from './profilepicture.module.scss';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

class Profilepicture extends React.Component{
constructor(props){
super(props);
this.state = {
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
handleChange = async (info) => {
    console.log(info);
    const formData = new FormData();
    formData.append('avatar', info);
        const fetchRes = await axios.post('http://localhost:5000/chat/test123',formData);
    const data =  fetchRes.data;
    console.log(data);
    const newBlob = new Blob([data],{type: 'image/png'});
    const image = `data:image/png;base64,${data}`;
    this.setState({image:image});
 
}


render(){
    return(
        <div className = {styles.container__profile}> 
        <Avatar size = {200} className = {styles.avatar} src = {`${this.state.image != null && this.state.image}`}/>
    <Upload name = 'avatar' action = {this.handleChange}>
    <Button size = "large">
    <UploadOutlined />Upload
    </Button>
    </Upload>
     </div>
    )



}

}

export default Profilepicture;
