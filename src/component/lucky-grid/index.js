
import { LuckyWheel, LuckyGrid } from '@lucky-canvas/react'
import React, { useState, useRef } from 'react'
function About() {
  const [blocks] = useState([
    { padding: '10px', background: '#869cfa' },
    { padding: '10px', background: '#e9e8fe' },
  ])
  const [prizes] = useState([
    { x: 0, y: 0, fonts: [{ text: '空', top: '35%' }] },
    { x: 1, y: 0, fonts: [{ text: '100￥', top: '35%' }] },
    { x: 2, y: 0, fonts: [{ text: '空', top: '35%' }] },
    { x: 2, y: 1, fonts: [{ text: '50￥', top: '35%' }] },
    { x: 2, y: 2, fonts: [{ text: '空', top: '35%' }] },
    { x: 1, y: 2, fonts: [{ text: '10￥', top: '35%' }] },
    { x: 0, y: 2, fonts: [{ text: '空', top: '35%' }] },
    { x: 0, y: 1, fonts: [{ text: '空', top: '35%' }] },
  ])
  const [buttons] = useState([
    {
      x: 1, y: 1,
      background: '#9c9dd8',
      fonts: [{ text: '开始', top: '35%' }],
    },
  ])
  const myLucky = useRef()
  return (
    <div className='box' >
      <LuckyGrid
        ref={myLucky}
        width="300px"
        height="300px"
        blocks={blocks}
        prizes={prizes}
        buttons={buttons}
        defaultConfig={
          { stopRange: 0.8 }
        }
        speed={30}
        defaultStyle={{
          background: '#b8c5f2'
        }}
        onStart={() => { // 点击抽奖按钮会触发star回调
          // 开始游戏
          myLucky.current.play()
          // 使用定时器模拟接口
          setTimeout(() => {
            const arr = [0, 2, 4, 6, 7]
            const index = Math.floor(Math.random() * 5)
            // 结束游戏, 并抽第号奖品
            myLucky.current.stop(arr[index])
          }, 3000)
        }}
        onEnd={prize => { // 抽奖结束会触发end回调
          alert('恭喜你抽到 ' + prize.fonts[0].text)
        }}
      />
    </div>
  );
}

export default About;