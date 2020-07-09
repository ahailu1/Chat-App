import React from 'react';
import {Row, Col, Form, Input, Button} from 'antd';
import { Tabs } from 'antd';
import { AppleOutlined, AndroidOutlined } from '@ant-design/icons';
import styles from './friendslist.module.scss';
class Friendslist extends React.Component{


render(){
    const {TabPane} = Tabs;
    return(
        <Tabs defaultActiveKey = '2'>
            <TabPane key = "1" tab = {
                <span className = {styles.tab}>
                   <AppleOutlined/> 
                   Friends
                </span>
                            }
                >

            </TabPane>
            <TabPane key = "2" tab = {
                <span className = {styles.tab}>
                   <AppleOutlined/> 
                   Requests
                </span>
                            }
                >

            </TabPane>
            <TabPane key = "3" tab = {
                <span className = {styles.tab}>
                   <AppleOutlined/> 
                   Pending
                </span>
                            }
                >

            </TabPane>
        </Tabs>
    )
}

}
export default Friendslist;