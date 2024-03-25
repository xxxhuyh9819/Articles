import { Link, useNavigate } from "react-router-dom";
import { Card, Form, Input, Button } from "antd";
import "../styles/Login.css";
import { useDispatch } from "react-redux";
import { fetchLoginInfo } from "../store/modules/user";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

const Login = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const result = await dispatch(fetchLoginInfo(values));
    if (result.status === 200) {
      alert("Logged in successfully!");
      navigate("/");
    } else {
      alert(`Error ${result.status}: ${result.data}`);
      form.resetFields();
    }
  };

  return (
    <div className="login">
      <Card className="login-container">
        <h1 className="login-logo">Welcome!</h1>
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
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              Login
            </Button>
          </Form.Item>
        </Form>
        <span>
          Don&apos;t have an account?{" "}
          <Link to={"/register"}>Create an account</Link>
        </span>
      </Card>
    </div>
  );
};

export default Login;
