import logo from './logo.svg';
import './App.css';
import { LuckyWheel, LuckyGrid } from '@lucky-canvas/react'
import React, { useState, useRef } from 'react'
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
import routes from './routes';
import { Layout, Space } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';

const { Header, Footer, Sider, Content } = Layout;

function App() {
  const items = [{
    label: (<Link to='/'>转盘</Link>),
    key: '/',
    icon: <MailOutlined />,
  }, {
    label: (<Link to='/lucky-grid'>九宫格</Link>),
    key: '/lucky-grid',
    icon: <AppstoreOutlined />,
  }, {
    label: (<Link to='/slot-machine'>豹子机</Link>),
    key: '/slot-machine',
    icon: <SettingOutlined />,
  }, {
    label: (<Link to='/gpt'>gpt</Link>),
    key: '/gpt',
    icon: <SettingOutlined />,
  },]
  const [current, setCurrent] = useState('zp');

  const onClick = (e) => {
    setCurrent(e.key);
  };
  const { pathname } = useLocation();
  React.useEffect(() => {
    console.log(111);

    setCurrent(pathname || '/')
  }, [pathname])


  return (
    <Layout>
      <Header style={headerStyle}>
        <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
        {/* <Link to='/'>转盘</Link>
        <Link to='/about'>about</Link> */}
      </Header>
      <Content style={contentStyle}>
        {/* <BrowserRouter basename='/home'> */}
        <React.Suspense fallback={null}>
          <Routes>
            {routes.map(({ path, component: Component }) => (
              <Route key={path} element={<Component />} path={path} />
            ))}
          </Routes>
        </React.Suspense>
        {/* </BrowserRouter> */}
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
  backgroundColor: '#fff'
  // backgroundColor: '#7dbcea',
};

const contentStyle = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  // backgroundColor: '#108ee9',
  height: 'calc(100vh - 64px)'
};

export default App;
