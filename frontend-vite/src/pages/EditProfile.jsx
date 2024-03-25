import { Button, Form, Input } from "antd";
import { useSelector, useDispatch } from "react-redux";
import "../styles/EditProfile.css";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { updateBio, updateUsername } from "../store/modules/user";
import { updatePasswordAPI } from "../apis/user";

const EditProfile = () => {
  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  async function handleUpdateUsername(values) {
    if (userInfo.user_name === values.new_username) {
      alert("New name can't be the same as the old name!");
      return;
    }
    let form = { ...userInfo, new_username: values.new_username };
    const result = await dispatch(updateUsername(form));
    if (result.status === 200) {
      alert("Username updated Successfully!");
    } else {
      alert(`Error ${result.status}: ${result.data}`);
    }
  }

  async function handleUpdatePassword(values) {
    if (values.old_password === values.new_password) {
      alert("New name can't be the same as the old password!");
    }
    let formData = { ...userInfo, ...values };
    const result = await updatePasswordAPI(formData);
    if (result.status === 200) {
      alert("Username updated Successfully!");
      form.resetFields();
    } else {
      alert(`Error ${result.status}: ${result.data}`);
    }
  }

  async function handleUpdateBio(values) {
    if (userInfo.user_bio === values.new_bio) {
      alert("New bio can't be the same as the old bio!");
      return;
    }
    let form = { ...userInfo, new_bio: values.new_bio };
    const result = await dispatch(updateBio(form));
    if (result.status === 200) {
      alert("Bio updated Successfully!");
    } else {
      alert(`Error ${result.status}: ${result.data}`);
    }
  }

  return (
    <div>
      <h2>Edit your profile</h2>

      <Form validateTrigger="onBlur" onFinish={handleUpdateUsername}>
        <div className="form-group">
          <Form.Item
            initialValue={userInfo.user_name}
            className="form-group-input"
            name="new_username"
            label="Username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              allowClear
              className="form-group-input"
              showCount
              maxLength={20}
            />
          </Form.Item>

          <Form.Item className="form-group-button">
            <Button type="primary" htmlType="submit" size="large" block>
              Update username
            </Button>
          </Form.Item>
        </div>
      </Form>

      <Form
        form={form}
        validateTrigger="onBlur"
        onFinish={handleUpdatePassword}
      >
        <div className="form-group">
          <Form.Item
            className="form-group-input"
            name="old_password"
            label="Old password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              allowClear
              className="form-group-input"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item
            className="form-group-input"
            name="new_password"
            label="New password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              allowClear
              className="form-group-input"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item className="form-group-button">
            <Button type="primary" htmlType="submit" size="large" block>
              Update password
            </Button>
          </Form.Item>
        </div>
      </Form>

      <Form validateTrigger="onBlur" onFinish={handleUpdateBio}>
        <Form.Item
          name="new_bio"
          label="Bio"
          initialValue={userInfo.user_bio !== null ? userInfo.user_bio : ""}
          rules={[{ required: true, message: "Contents can not be empty!" }]}
        >
          <Input.TextArea allowClear style={{ minHeight: 200 }} />
        </Form.Item>

        <Form.Item className="form-group-button">
          <Button type="primary" htmlType="submit" size="large" block>
            Update bio
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EditProfile;
