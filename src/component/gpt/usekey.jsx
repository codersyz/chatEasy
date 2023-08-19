
import React, { useState, useRef } from 'react';
import {
  Button,
  Input,
  Space,
  message,
  Modal,
  Form,
  Popconfirm,
  Dropdown
} from 'antd';
import { DownOutlined } from '@ant-design/icons';


function UseKey() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fromRef = useRef(null)
  const handCloseModal = () => {
    setIsModalOpen(false)
  }
  const handOpenModal = () => {
    setIsModalOpen(true)
  }

  const onFinish = (values) => {
    console.log('Success:', values);
    const { key } = values
    if (key) {
      localStorage.setItem('openaiKey', key)
      message.success({
        content: '设置成功',
      });
      window.location.reload()
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleOk = (value) => {
    console.log(value);
    fromRef.current.validateFields().then((values) => {
      // 校验通过
      handCloseModal();
      // 执行表单的提交操作
      fromRef.current.submit();

    }).catch((error) => {
      // 校验不通过
      console.log('Form validation error:', error);
    });
  };

  const items = [
    {
      key: '1',
      label: (
        <Button type='link' onClick={handOpenModal}>使用key</Button>
      ),
    },
    {
      key: '2',
      label: (
        <Popconfirm
          title="清除key"
          description="您确定要清除你设置的key吗?"
          okText="确认"
          cancelText="取消"
          onConfirm={() => {
            localStorage.removeItem('openaiKey')
            message.success({
              content: '清除成功',
            });
            window.location.reload()
          }}
        >
          <Button success='true' type='link'>清除key</Button>
        </Popconfirm>
      ),
    }
  ]

  return (
    <Space>
      <Dropdown menu={{ items }}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            key<DownOutlined />
          </Space>
        </a>
      </Dropdown>
      <Modal title="绑定自己的key" open={isModalOpen} onOk={handleOk} onCancel={handCloseModal}>
        <Form
          name="fromRef"
          ref={fromRef}
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 18,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{}}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="key"
            name="key"
            rules={[
              {
                required: true,
                message: '请输入您openai的key',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Space >
  );
}

export default UseKey;
