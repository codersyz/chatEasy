
import { LuckyWheel, LuckyGrid } from '@lucky-canvas/react'
import React, { useState, useRef } from 'react'
import { Cloud } from "laf-client-sdk";
import { Button, Input, Row, Col, Space, message, Avatar, List, Spin } from 'antd'
import styles from './index.module.css';
import axios from 'axios'
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import moment from 'moment'

const MyList = React.forwardRef((props, ref) => {

  return <List
    pagination={false}
    ref={ref}
    dataSource={props.data}
    className={styles.chatBox}
    // noData={false}
    // locale={{ emptyText: '暂无信息' }}
    renderItem={(item, index) => (
      <List.Item>
        <List.Item.Meta
          avatar={
            <Avatar src={item.avatar} />
          }
          title={moment().format('YYYY-MM-DD HH:mm:ss')}
          description={(item.text ? <div className={styles.codeSty} dangerouslySetInnerHTML={{ __html: item.text }}></div> : <Spin />)}
        />
      </List.Item>
    )}
  />
})

const { Search } = Input;
function Gpt() {
  const scrollRef = useRef(null);
  // 创建 cloud 对象 这里需要将 <appid> 替换成自己的 App ID
  const cloud = new Cloud({
    baseUrl: "https://vvxw0a.laf.dev",
    getAccessToken: () => "", // 这里不需要授权，先填空
    timeout: 60000
  });

  const setScreen = () => {
    setTimeout(() => {
      document.querySelector('.ant-list-items').scrollTo(0, document.querySelector('.ant-list-items').scrollHeight);
    }, 0);
  }

  const [parentMessageId, setParentMessageId] = React.useState(null)
  const [value, setValue] = React.useState('')
  const [listMessage, setListMessage] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  async function send() {
    const question = value

    // 我们提问的内容
    // const message = '用js写一个防抖函数';
    let res;
    if (question.trim() === '') {
      message.warning('问题不能为空')
      setValue('')
      setScreen();
      return
    }
    setListMessage(pre => ([...pre, {
      text: value,
      avatar: "/avatar.png",
    }]))
    setScreen()
    setValue('')
    setLoading(true)
    // 有上下文 id 就传入
    // if (!parentMessageId) {
    //   res = await cloud.invoke("send", { message: value });
    // } else {
    //   res = await cloud.invoke("send", { message: value, parentMessageId: parentMessageId });
    // }
    try {
      const md = new MarkdownIt({
        highlight: function (str, lang) {

          if (lang && hljs.getLanguage(lang)) {
            try {
              return (
                '<pre class="hljs"><code>' +
                hljs.highlight(lang, str, true).value +
                "</code></pre>"
              );
            } catch (__) { }
          }
          return (
            '<pre class="hljs"><code>' +
            md.utils.escapeHtml(str.replace(/[\r\n]+/g, "\n")) +
            "</code></pre>"
          );
        },
      });
      setListMessage(pre => {
        return [...pre, {
          text: "",
          avatar: "/gpt.png",
        }]
      })
      const obj = { message: question }
      if (parentMessageId) {
        obj.parentMessageId = parentMessageId
      }

      axios({
        url: "https://vvxw0a.laf.dev/send",
        method: "post",
        data: obj,
        responseType: "json",
        // headers: { "Accept-Encoding": "gzip, deflate, br" },
        onDownloadProgress(progressEvent) {
          const xhr = progressEvent.event.target;
          const { responseText } = xhr;
          const data = JSON.parse(JSON.parse(JSON.stringify(responseText)))
          setParentMessageId(data?.id)

          setListMessage(pre => {
            const arr = pre.map((item, index) => {
              if (index === (pre.length - 1)) {
                return {
                  ...item,
                  text: md.render(data?.text)
                }
              }
              return item
            })
            return arr
          })
          setLoading(false)
          setScreen();
        },
      }).then(res => { });
    } catch (error) {
      console.log(error);
      return;
    }
    // res.text = res.text.replace(/\\n/g, "<br/>");
    // 这个是上下文 id
    setParentMessageId(res?.id)

  }

  return (
    <div >
      {/* {listMessage?.map((item, index) => {
        return (
          <div key={index}>
            <Avatar src={<img src={item.avatar} alt="chatgpt" />} />
            <div dangerouslySetInnerHTML={{ __html: item.text }}></div>
          </div>
        )
      })} */}
      {/* <List
        pagination={false}
        ref={scrollRef}
        dataSource={listMessage}
        className={styles.chatBox}
        // noData={false}
        // locale={{ emptyText: '暂无信息' }}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar src={item.avatar} />
              }
              title={moment().format('YYYY-MM-DD HH:mm:ss')}
              description={(item.text ? <div className={styles.codeSty} dangerouslySetInnerHTML={{ __html: item.text }}></div> : <Spin />)}
            />
          </List.Item>
        )}
      /> */}
      <MyList ref={scrollRef} data={listMessage} />
      <Row justify="center" className={styles.searchArea}>
        <Col span={18}><Search onChange={(e) => {
          setValue(e.target.value)
        }} placeholder="input search text" value={value} onSearch={send} enterButton={(<svg
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
          viewBox="-2 0 32 16"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 mr-1"
          height="1.5em"
          width="1.5em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>)} size="large" loading={loading} /></Col>
      </Row>
    </div>
  );
}

export default Gpt;
