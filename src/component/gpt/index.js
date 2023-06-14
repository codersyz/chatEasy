
import { LuckyWheel, LuckyGrid } from '@lucky-canvas/react'
import React, { useState, useRef } from 'react'
import { Cloud } from "laf-client-sdk";
import { Button, Input } from 'antd'
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
  async function send() {

    // 我们提问的内容
    // const message = '用js写一个防抖函数';

    let res;
    // 与云函数逻辑一样，有上下文 id 就传入
    if (!parentMessageId) {
      res = await cloud.invoke("send", { message: value });
    } else {
      res = await cloud.invoke("send", { message: value, parentMessageId: parentMessageId });
    }

    // 回复我们的内容在 res.text

    // 这个是上下文 id
    setParentMessageId(res.parentMessageId)
    setAnswer(res.text)
    console.log(res, 'res');

  }
  return (
    <div className='box' >
      <Input value={value} onChange={(e) => {
        console.log(e.target.value, 'e');
        setValue(e.target.value)
      }}></Input>
      <Button onClick={send}>send</Button>
      <p style={{ color: '#333' }}>{answer}</p>
    </div>
  );
}

export default Gpt;
