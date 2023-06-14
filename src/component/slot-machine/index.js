
import { LuckyWheel, LuckyGrid, SlotMachine } from '@lucky-canvas/react'
import React, { useState, useRef } from 'react'
import styles from './index.module.css';
import { Alert } from 'antd';
import Marquee from 'react-fast-marquee';
function SlotMach() {
  const [blocks] = useState([
    { padding: '10px', background: '#869cfa' },
    { padding: '10px', background: '#e9e8fe' },
  ])
  const [prizes] = useState([
    { fonts: [{ text: '0', top: '15%' }] },
    { fonts: [{ text: '1', top: '15%' }] },
    { fonts: [{ text: '2', top: '15%' }] },
    { fonts: [{ text: '3', top: '15%' }] },
    { fonts: [{ text: '4', top: '15%' }] },
    { fonts: [{ text: '5', top: '15%' }] },
    { fonts: [{ text: '6', top: '15%' }] },
    { fonts: [{ text: '7', top: '15%' }] },
    { fonts: [{ text: '8', top: '15%' }] },
    { fonts: [{ text: '9', top: '15%' }] },
  ])
  const [buttons] = useState([
    {
      x: 1, y: 1,
      background: '#9c9dd8',
      fonts: [{ text: '开始', top: '35%' }],
    },
  ])
  const [slots] = useState([
    { order: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], direction: 1 },
    { order: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0], direction: -1 },
    { order: [2, 3, 4, 5, 6, 7, 8, 9, 0, 1], direction: 1 },
  ])
  const myLucky = useRef()
  const playGame = () => {
    myLucky.current.play()
    setTimeout(() => {
      // 假设 4 种结果
      const res = [
        [9, 9, 6],
        [0, 0, 7],
        [6, 6, 6],
        [8, 8, 8],
        [3, 2, 6],
        [4, 2, 6],
      ]
      // 随机取一组数据
      const index = res[Math.random() * 6 >> 0]
      // 调用 stop 方法停止游戏
      myLucky.current.stop(index)
    }, 500);
  }

  return (
    <div className='box' >

      <div>
        <Alert
          banner
          style={{
            position: 'absolute',
            top: '100px',
            left: '50%',
            transform: 'translateX(-50%)'
          }}
          message={
            <Marquee pauseOnHover gradient={false}>
              温馨提示：本抽奖（豹子机暂未设置奖项）
            </Marquee>
          }
        />
        <SlotMachine
          ref={myLucky}
          width="240px"
          height="180px"
          blocks={blocks}
          prizes={prizes}
          buttons={buttons}
          slots={slots}
          defaultConfig={
            {
              rowSpacing: '20px',
              colSpacing: '10px'
            }
          }
          speed={30}
          defaultStyle={{
            borderRadius: Infinity,
            background: '#bac5ee',
            fontSize: '32px',
            fontColor: '#333'
          }}
        // onStart={() => { // 点击抽奖按钮会触发star回调
        // 开始游戏
        // myLucky.current.play()
        // // 使用定时器模拟接口
        // setTimeout(() => {
        //   // 假设 4 种结果
        //   const res = [
        //     [9, 9, 6],
        //     [0, 0, 7],
        //     [6, 6, 6],
        //     [8, 8, 8]
        //   ]
        //   // 随机取一组数据
        //   const index = res[Math.random() * 4 >> 0]
        //   // 调用 stop 方法停止游戏
        //   myLucky.current.stop(index)
        // }, 3000)
        // }}
        // onEnd={(prize) => { // 抽奖结束会触发end回调
        //   console.log(prize, 'prize');

        //   alert('恭喜你抽到数字 ' + prize.fonts[0].text)
        // }}
        />
        <div className={styles.luckyBtn} onClick={playGame}>开始游戏</div>
      </div>
    </div>
  );
}

export default SlotMach;