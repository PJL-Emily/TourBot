import React, { useState } from 'react';
import { Button, Modal, Form, Radio } from 'antd';
import '../scss/main.scss';

const CollectionCreateForm = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title="請填寫以下欄位，以幫助我們推薦更適合的店家給您！"
      okText="送出"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
            // TODO: redirect to chatpage
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          modifier: 'public',
        }}
      >
        <Form.Item
          name="gender"
          label="您的性別"
          rules={[
            {
              required: true,
              message: '請填入您的性別！',
            },
          ]}
        >
          <Radio.Group>
            <Radio value="M">男</Radio>
            <Radio value="F">女</Radio>
            <Radio value="N">我不願透露</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="age"
          label="您的年齡層"
          rules={[
            {
              required: true,
              message: '請填入您的年齡層！',
            },
          ]}>
            <Radio.Group>
              <Radio value="1">20 歲以下</Radio>
              <Radio value="2">20～30 歲</Radio>
              <Radio value="3">31～40 歲</Radio>
              <Radio value="4">41～50 歲</Radio>
              <Radio value="5">50～60 歲</Radio>
              <Radio value="6">60 歲以上</Radio>
              <Radio value="N">我不願透露</Radio>
            </Radio.Group>
        </Form.Item>
        <Form.Item
          name="purpose"
          label="您這次旅遊的目的"
          rules={[
            {
              required: true,
              message: '請填入您的旅遊目的！',
            },
          ]}>
            <Radio.Group>
              <Radio value="sightseeing">觀光旅程</Radio>
              <Radio value="business">商業拜訪</Radio>
              <Radio value="N">我不願透露</Radio>
            </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const CollectionsPage = () => {
  const [visible, setVisible] = useState(false);

  const onCreate = (values) => {
    // TODO: axios.post + then/catch
    console.log('Received values of form: ', values);
    setVisible(false);
  };

  return (
    <div>
      <Button
        type="primary"
        size="large"
        shape="round"
        className="chatBtn"
        onClick={() => {
          setVisible(true);
        }}
      >
        進入聊天室
      </Button>
      <CollectionCreateForm
        visible={visible}
        onCreate={onCreate}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </div>
  );
};

export default CollectionsPage;