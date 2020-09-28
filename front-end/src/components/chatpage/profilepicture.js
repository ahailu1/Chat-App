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
  
  try {
    let getPic = await axios.get(`${this.props.actionUrl}`, {
    headers: { Authorization:'Bearer' + token }});
    console.log(getPic.data);
    this.setState({profilePath: getPic.data.profilePicture});
  } catch (err) {
     let path = err.response.data.default;
    this.setState({profilePath: 'default--profilepicture.png'});
     console.log(err);
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
      console.log(info.file.originFileObj);
    this.getBase64(info.file.originFileObj, imageUrl =>
      this.setState({
        imageUrl,
        loading: false,
      }),
    );
  }
}

render(){
  let {username} = this.props.userData;
  let {imageUrl} = this.state;

  return(
        <div className = {`${styles.container__profile} ${this.props.toggled && styles.toggled}`}> 
        <Upload
        name="avatar"
        listType="picture"
        className={styles.avatar__uploader}
        showUploadList={false}
        action= {this.props.actionUrl}
        beforeUpload={this.beforeUpload}
        onChange={this.handleChange}
      >
                {this.state.profilePath ? <Avatar className = {styles.image} src={`/images/${this.state.profilePath}`} alt="avatar" size = {this.props.setSize} /> : this.uploadButton()}
    </Upload>
     </div>
    )
}

}

export default Profilepicture;
