import { Button, Form, Input, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { publishNewArticleAPI } from "../apis/article";
import { useNavigate } from "react-router-dom";
import { setArticles } from "../store/modules/article";

function NewArticle() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const { articleList } = useSelector((state) => state.article);

  async function handlePublish(values) {
    let form = {
      ...values,
      user_name: userInfo.user_name,
      user_token: userInfo.user_token,
    };
    console.log("form in new article:", form);
    const result = await publishNewArticleAPI(form);
    if (result.status === 200) {
      message.info("Article posted Successfully!");
      dispatch(setArticles([...articleList, result.data]));
      navigate("/");
    } else {
      message.warning(`Error ${result.status}: ${result.data}`);
    }
  }

  return (
    <div>
      <h2>Post a new article right now!</h2>
      <Form validateTrigger="onBlur" onFinish={handlePublish} style={{}}>
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
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
export default NewArticle;
