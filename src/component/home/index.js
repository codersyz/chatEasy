
import { LuckyWheel, LuckyGrid } from '@lucky-canvas/react'
import React, { useState, useRef } from 'react'
import styles from './index.css'
function Home() {
  const [blocks] = useState([
    { padding: '10px', background: '#869cfa' }
  ])
  const [prizes] = useState([
    { background: '#e9e8fe', fonts: [{ text: '100￥', top: '35%' }] },
    { background: '#b8c5f2', fonts: [{ text: '50￥', top: '35%' }] },
    { background: '#e9e8fe', fonts: [{ text: '20￥', top: '35%' }] },
    { background: '#b8c5f2', fonts: [{ text: '10￥', top: '35%' }] },
    { background: '#e9e8fe', fonts: [{ text: '谢谢惠顾', top: '35%' }] },
    { background: '#b8c5f2', fonts: [{ text: '谢谢惠顾', top: '35%' }] },
  ])
  const [buttons] = useState([
    { radius: '40%', background: '#617df2' },
    { radius: '35%', background: '#afc8ff' },
    {
      radius: '30%', background: '#869cfa',
      pointer: true,
      fonts: [{ text: '开始', top: '-10px' }]
    }
  ])
  const myLucky = useRef()
  return (
    <div className='box' >
      <LuckyWheel
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
        onStart={() => { // 点击抽奖按钮会触发star回调
          myLucky.current.play()
          setTimeout(() => {
            // const index = Math.random() * 6 >> 0
            const index = Math.random() > 0.5 ? 5 : 4
            myLucky.current.stop(index)
          }, 2500)
        }}
        onEnd={prize => { // 抽奖结束会触发end回调
          alert('恭喜你抽到 ' + prize.fonts[0].text)
        }}
      />
    </div>
  );
}

export default Home;
