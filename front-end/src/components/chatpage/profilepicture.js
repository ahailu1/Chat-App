import React, {Component,PureComponent} from 'react';
import {Row, Col, Form, Input, Button, Layout, Avatar, Upload, icon, message} from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './profilepicture.module.scss';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';

class Profilepicture extends PureComponent{
constructor(props){
super(props);
this.loadProfile = this.loadProfile.bind(this);

this.state = {
    profilepic: null,
    image: null,
    loading: false,
    imageUrl: null,
            };
}

componentDidMount(){
  this.loadProfile();
}
 beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
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


} else {
  }  
}
uploadButton = () => {
  let {loading} = this.state;
  return (
  <div>
    {loading ? <LoadingOutlined /> : <PlusOutlined />}
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
  )
};


handleButton = (e) => {
e.preventDefault();
console.log('prevented');
}
getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

handleChange = info => {
  if (info.file.status === 'uploading') {
    this.setState({ loading: true });
    return;
  }
  if (info.file.status === 'done') {
    // Get this url from response in real world.
    this.getBase64(info.file.originFileObj, imageUrl =>
      this.setState({
        imageUrl,
        loading: false,
      }),
    );
  }
}

render(){
  let {username, imageUrl} = this.props.userData;

  return(
        <div className = {styles.container__profile}> 
        <Avatar size = {120} className = {styles.avatar} src = {`${this.state.profilepic == null ? '/images/default--profilepicture.png' : this.state.profilepic}`} />
        <Upload
        name="avatar"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action= {`http://localhost:5000/chat/${username}`}
        beforeUpload={this.beforeUpload}
        onChange={this.handleChange}
      >
                {imageUrl ? <img src={`images/${imageUrl}`} alt="avatar" style={{ width: '100%' }} /> : this.uploadButton()}

    </Upload>
     </div>
    )

}

}

export default Profilepicture;
