import { useEffect, useState } from "react";
import { Button, Form, Input, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  checkArticleAPI,
  getArticleByIdAPI,
  updateArticleAPI,
} from "../apis/article";
import { useSelector } from "react-redux";

function UpdateArticle() {
  const navigate = useNavigate();
  const [article, setArticle] = useState({});
  const [form] = Form.useForm();
  const param = useParams();
  const { userInfo } = useSelector((state) => state.user);

  async function handleUpdate(values) {
    if (
      values.title === article.title &&
      values.contents === article.contents
    ) {
      alert("Both title and contents are unchanged!");
      return;
    }
    let form = {
      author: userInfo.user_name,
      api_key: userInfo.user_token,
      article_id: Number(param.id),
    };
    if (
      values.title !== article.title &&
      values.contents === article.contents
    ) {
      form = { ...form, title: values.title };
    } else if (
      values.title === article.title &&
      values.contents !== article.contents
    ) {
      form = { ...form, contents: values.contents };
    } else {
      form = { ...form, ...values };
    }
    const result = await updateArticleAPI(form);
    if (result.status === 200) {
      alert("Article updated Successfully!");
      navigate("/");
    } else {
      alert(`Error ${result.status}: ${result.data}`);
    }
  }

  useEffect(() => {
    async function getArticleById(id) {
      if (!userInfo.user_token) {
        navigate("/login");
      }
      const response = await checkArticleAPI(id, userInfo.user_token);
      if (response.status === 200) {
        const result = await getArticleByIdAPI(id);
        const data = result.data;
        setArticle(data);
      } else {
        message.warning(response.data);
        navigate("/");
      }
    }
    getArticleById(param.id);
  }, [navigate, param, userInfo.user_token]);

  useEffect(() => {
    // if (JSON.stringify(article) !== JSON.stringify({})) {
    form.setFieldValue("title", article.title);
    form.setFieldValue("contents", article.contents);
  }, [article, form]);

  return (
    <div>
      <h2>Update your article</h2>
      <Form
        form={form}
        validateTrigger="onBlur"
        onFinish={handleUpdate}
        style={{}}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Title can not be empty!" }]}
        >
          <Input
            allowClear
            className="form-group-input"
            showCount
            maxLength={100}
          />
        </Form.Item>

        <Form.Item
          label="Contents"
          name="contents"
          rules={[{ required: true, message: "Contents can not be empty!" }]}
        >
          <Input.TextArea allowClear style={{ minHeight: 400 }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
export default UpdateArticle;
