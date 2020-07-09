import { Card } from 'antd';
import { UploadOutlined, WechatOutlined, WechatFilled } from '@ant-design/icons';
import React from 'react';
import styles from './description.module.scss';
const Description = (props) => {

    
    return(
        <div className = {styles.container}>
             <div className = {styles.container__icon}>{props.icon}</div>
        <div className = {styles.container__text}>
          <div className = {styles.heading}>{props.heading}</div>
        <div className = {styles.paragraph}>{props.paragraph}</div>
        </div>
        </div>

    )

}
export default Description;