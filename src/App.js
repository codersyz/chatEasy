import logo from './logo.svg';
import './App.css';
import React, { useState, useRef } from 'react'
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
import routes from './routes';
import { Layout, Space, ConfigProvider, Row, Col, Button, Modal } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined, AliwangwangOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import zhCN from 'antd/locale/zh_CN';
import 'antd/dist/reset.css';
import UseKey from './component/gpt/usekey'

const { Header, Footer, Sider, Content } = Layout;

function App() {
  const items = [{
    label: (<Link to='/'>chatgpt</Link>),
    key: '/',
    icon: <AliwangwangOutlined />,
  }, {
    label: (<Link to='/lucky-grid'>九宫格</Link>),
    key: '/lucky-grid',
    icon: <AppstoreOutlined />,
  }, {
    label: (<Link to='/slot-machine'>豹子机</Link>),
    key: '/slot-machine',
    icon: <SettingOutlined />,
  }, {
    label: (<Link to='/turntable'>转盘</Link>),
    key: '/turntable',
    icon: <MailOutlined />,
  },]
  const [current, setCurrent] = useState('zp');

  const onClick = (e) => {
    setCurrent(e.key);
  };
  const { pathname } = useLocation();
  React.useEffect(() => {
    setCurrent(pathname || '/')
  }, [pathname])


  return (
    <Layout>
      <Header style={headerStyle}>
        <Row justify='space-between'>
          <Col span={20}><Menu onClick={onClick} style={{ backgroundColor: '#ADD8E6', color: '#808080' }} selectedKeys={[current]} mode="horizontal" items={items} /></Col>
          <Col span={4}><UseKey></UseKey></Col>
        </Row>

      </Header>
      <Content style={contentStyle}>
        <ConfigProvider locale={zhCN}>
          <React.Suspense fallback={null}>
            <Routes>
              {routes.map(({ path, component: Component }) => (
                <Route key={path} element={<Component />} path={path} />
              ))}
            </Routes>
          </React.Suspense>
        </ConfigProvider>
      </Content>

    </Layout>
  );
}
const headerStyle = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#ADD8E6'
  // backgroundColor: '#7dbcea',
};

const contentStyle = {
  // textAlign: 'center',
  // minHeight: 120,
  // lineHeight: '120px',
  // color: '#fff',
  // backgroundColor: '#108ee9',
  height: 'calc(100vh - 64px)'
};

export default App;
