
import { LuckyWheel, LuckyGrid } from '@lucky-canvas/react'
import React, { useState, useRef } from 'react'
import { Cloud } from "laf-client-sdk";
import { Button, Input, Row, Col, Space } from 'antd'
import styles from './index.module.css';

const { Search } = Input;
function Gpt() {

  // 创建 cloud 对象 这里需要将 <appid> 替换成自己的 App ID
  const cloud = new Cloud({
    baseUrl: "https://vvxw0a.laf.dev",
    getAccessToken: () => "", // 这里不需要授权，先填空
    timeout: 60000
  });
  const [parentMessageId, setParentMessageId] = React.useState(null)
  const [value, setValue] = React.useState('')
  const [answer, setAnswer] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  async function send() {
    setValue('')
    // 我们提问的内容
    // const message = '用js写一个防抖函数';
    setLoading(true)
    let res;
    // 与云函数逻辑一样，有上下文 id 就传入
    if (!parentMessageId) {
      res = await cloud.invoke("send", { message: value });
    } else {
      res = await cloud.invoke("send", { message: value, parentMessageId: parentMessageId });
    }
    setLoading(false)
    // 这个是上下文 id
    setParentMessageId(res.parentMessageId)
    setAnswer(res.text)
    console.log(res, 'res');

  }
  return (
    <div style={{ paddingTop: '50px' }}>
      <Row justify="center" className={styles.searchArea}>
        <Col span={18}><Search onChange={(e) => {
          setValue(e.target.value)
        }} placeholder="input search text" value={value} onSearch={send} enterButton="Search" size="large" loading={loading} /></Col>
      </Row>
    </div>
  );
}

export default Gpt;
{/* <Col span={18}>
          <Space>
            <Input value={value} onChange={(e) => {
              console.log(e.target.value, 'e');
              setValue(e.target.value)
            }}></Input>
            <Button type='primary' onClick={send}>send</Button>
          </Space>
        </Col> */}
