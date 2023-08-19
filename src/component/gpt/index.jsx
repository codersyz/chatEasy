import { LuckyWheel, LuckyGrid } from '@lucky-canvas/react';
import React, { useState, useRef } from 'react';
import { Cloud } from 'laf-client-sdk';
import {
  Button,
  Input,
  Row,
  Col,
  Space,
  message,
  Avatar,
  List,
  Spin,
  Alert,
} from 'antd';
import styles from './index.module.css';
import axios from 'axios';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';
import moment from 'moment';
import Marquee from 'react-fast-marquee';

import mdKatex from '@traptitech/markdown-it-katex'

const MyList = React.forwardRef((props, ref) => {
  return (
    <List
      pagination={false}
      ref={ref}
      dataSource={props.data}
      className={styles.chatBox}
      // noData={false}
      // locale={{ emptyText: '暂无信息' }}
      renderItem={(item, index) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src={item.avatar} />}
            title={item.time ?? moment().format('YYYY-MM-DD HH:mm:ss')}
            description={
              item.text ? item?.status === 400 ? (<Alert message={item.text} banner />) : (
                <div
                  className={styles.codeSty}
                  dangerouslySetInnerHTML={{ __html: item.text }}></div>
              ) : (
                <Spin />
              )
            }
          />
        </List.Item>
      )}
    />
  );
});

const { Search } = Input;
function Gpt() {
  hljs.configure({
    ignoreUnescapedHTML: true//不要将有关代码块中未转义 HTML 的警告记录到控制台
  });
  // const scrollRef = useRef(null);
  // 创建 cloud 对象 这里需要将 <appid> 替换成自己的 App ID
  // const cloud = new Cloud({
  //   baseUrl: 'https://<appid>.laf.dev',
  //   getAccessToken: () => '', // 这里不需要授权，先填空
  //   timeout: 60000,
  // });

  const setScreen = () => {
    setTimeout(() => {
      document
        .querySelector('.ant-list-items')
        .scrollTo(0, document.querySelector('.ant-list-items').scrollHeight);
    }, 0);
  };

  const [parentMessageId, setParentMessageId] = React.useState(null);
  const [value, setValue] = React.useState('');
  const [listMessage, setListMessage] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  hljs.highlightAll();
  async function send() {
    const question = value;

    // 我们提问的内容
    // const message = '用js写一个防抖函数';
    let res;
    if (question.trim() === '') {
      message.warning('问题不能为空');
      setValue('');
      setScreen();
      return;
    }
    setListMessage((pre) => [
      ...pre,
      {
        text: value,
        avatar: '/avatar.png',
        time: moment().format('YYYY-MM-DD HH:mm:ss')
      },
    ]);
    setScreen();
    setValue('');
    setLoading(true);
    // 有上下文 id 就传入
    // if (!parentMessageId) {
    //   res = await cloud.invoke("send", { message: value });
    // } else {
    //   res = await cloud.invoke("send", { message: value, parentMessageId: parentMessageId });
    // }
    try {
      const md = new MarkdownIt({
        linkify: true,
        highlight: function (str, lang) {
          if (lang && hljs.getLanguage(lang)) {
            try {
              // return (
              //   '<pre class="hljs"><code>' +
              //   // hljs.highlight(lang, str, true).value +
              //   hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
              //   '</code></pre>'
              // );
              return highlightBlock(hljs.highlight(str, { language: lang, ignoreIllegals: true, ignoreUnescapedHTML: true }).value, lang)
            } catch (__) { }
          }
          return (
            '<pre class="hljs"><code>' +
            md.utils.escapeHtml(str.replace(/[\r\n]+/g, '\n')) +
            '</code></pre>'
          );
        },
      });

      md.use(mdKatex, { blockClass: 'katexmath-block rounded-md p-[10px]', errorColor: ' #cc0000' })
      function highlightBlock(str, lang) {
        return `<pre class="pre-code-box"><div class="pre-code-header"><span class="code-block-header__lang">${lang}</span><span class="code-block-header__copy">复制代码</span></div><div class="pre-code"><code class="hljs code-block-body ${lang}">${str}</code></div></pre>`
      }
      setListMessage((pre) => {
        return [
          ...pre,
          {
            text: '',
            avatar: '/gpt.png',
            time: moment().format('YYYY-MM-DD HH:mm:ss')
          },
        ];
      });
      const obj = { message: question };
      if (parentMessageId) {
        obj.parentMessageId = parentMessageId;
      }
      const openaiKey = localStorage.getItem('openaiKey');
      if (openaiKey) {
        obj.key = openaiKey
      }

      axios({
        url: 'https://gvgvh4.laf.dev/send3',
        method: 'post',
        data: obj,
        // responseType: 'json',
        responseType: "stream",
        // headers: { "Accept-Encoding": "gzip, deflate, br" },
        onDownloadProgress(progressEvent) {
          const xhr = progressEvent.event.target;
          const { responseText, status } = xhr;
          // const data = JSON.parse(JSON.parse(JSON.stringify(responseText)));
          const data = responseText;
          // if (status === 200) {
          //   setParentMessageId(data?.id);
          // }
          const messageArr = data.split('chatGPTParentId=')
          if (messageArr.length === 2) {
            setParentMessageId(messageArr[1]);
          }
          setListMessage((pre) => {
            const arr = pre.map((item, index) => {
              if (index === pre.length - 1) {
                return {
                  ...item,
                  text: status === 200 ? md.render(messageArr[0]) : `出错啦，可能是key设置不正确，或者重新请求(openai限制1分钟请求三次)`,
                  status
                };
              }
              return item;
            });
            return arr;
          });
          setScreen();
        },
      }).then((res) => {
        setLoading(false);
        setScreen();
      }).catch((res) => {
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
      return;
    }
    // res.text = res.text.replace(/\\n/g, "<br/>");
    // 这个是上下文 id
    setParentMessageId(res?.id);
  }



  return (
    <div>
      <Alert type="warning" showIcon closable
        message={
          <Marquee pauseOnHover gradient={false}>
            不绑定key默认使用内置的key,绑定key后用的是自己的key,请确保设置的key有效,清除key后使用默认的
          </Marquee>
        } />
      <MyList data={listMessage} />
      <Row justify='center' className={styles.searchArea}>
        <Col span={18}>
          <Search
            onChange={(e) => {
              setValue(e.target.value);
            }}
            placeholder='input search text'
            value={value}
            onSearch={send}
            enterButton={
              <svg
                stroke='currentColor'
                fill='none'
                strokeWidth='2'
                viewBox='-2 0 32 16'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='h-4 w-4 mr-1'
                height='1.5em'
                width='1.5em'
                xmlns='http://www.w3.org/2000/svg'>
                <line x1='22' y1='2' x2='11' y2='13'></line>
                <polygon points='22 2 15 22 11 13 2 9 22 2'></polygon>
              </svg>
            }
            size='large'
            loading={loading}
          />
        </Col>
      </Row>
    </div>
  );
}

export default Gpt;
