import { Link, useNavigate } from "react-router-dom";
import { Card, Form, Input, Button } from "antd";
import "../styles/Register.css";
import { useDispatch } from "react-redux";
import { fetchRegisterInfo } from "../store/modules/user";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

const Register = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    if (values.confirm_password !== values.password) {
      alert("Password and confirm password should be the same!");
      form.resetFields();
      return;
    }
    const result = await dispatch(fetchRegisterInfo(values));
    if (result.status === 200) {
      alert("Account created successfully!");
      navigate("/");
    } else {
      alert(`Error ${result.status}: ${result.data}`);
      form.resetFields();
    }
  };

  return (
    <div className="profile">
      <Card className="register-container">
        <h1 className="profile-info">Create An Account</h1>
        <Form form={form} validateTrigger="onBlur" onFinish={onFinish}>
          <Form.Item
            className="form-item"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input allowClear size="large" placeholder="Enter username" />
          </Form.Item>

          <Form.Item
            className="form-item"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              allowClear
              size="large"
              placeholder="Enter password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item
            className="form-item"
            name="confirm_password"
            rules={[
              { required: true, message: "Please confirm your password!" },
            ]}
          >
            <Input.Password
              allowClear
              size="large"
              placeholder="Confirm password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Register
            </Button>
          </Form.Item>
        </Form>
        <span>
          Already have an account? <Link to={"/login"}>Login</Link>
        </span>
      </Card>
    </div>
  );
};

export default Register;
