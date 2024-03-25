import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Table,
  Space,
  Popconfirm,
  Button,
  message,
  Checkbox,
} from "antd";
import { EditOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import { fetchArticleList, setArticles } from "../store/modules/article";
import { deleteArticleAPI } from "../apis/article";
import { useLocalStorage } from "../hooks";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMyArticlesOnly, setShowMyArticlesOnly] = useLocalStorage(
    "show_my_articles",
    false
  );
  const [pagination, setPagination] = useLocalStorage("pagination", {
    page: 1,
    pageSize: 5,
  });
  const { articleList } = useSelector((state) => state.article);
  const { userInfo } = useSelector((state) => state.user);
  const myArticleList = articleList.filter((article) => {
    return article.author === userInfo.user_name;
  });

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      width: 300,
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text) => {
        return `${text.length > 20 ? text.slice(0, 20) + "..." : text}`;
      },
    },
    {
      title: "Author",
      dataIndex: "author",
      sorter: (a, b) => a.author.localeCompare(b.author),
      render: (text) => {
        return (
          <>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/profile/${text}`)}
            >
              {`${text.length > 20 ? text.slice(0, 20) + "..." : text}`}
            </div>
          </>
        );
      },
    },
    {
      title: "Update Time",
      dataIndex: "create_date",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.create_date.localeCompare(b.create_date),
    },
    {
      title: "Actions",
      render: (data) => {
        return (
          <Space size="middle">
            <Button
              shape="circle"
              onClick={() => navigate(`/details/${data.id}`)}
              icon={<EyeOutlined />}
              style={{ color: "#1f1e33" }}
            />

            {data.author === userInfo.user_name && (
              <Button
                shape="circle"
                onClick={() => navigate(`/update/${data.id}`, { state: data })}
                icon={<EditOutlined />}
                style={{ color: "#1f1e33" }}
              />
            )}

            {data.author === userInfo.user_name && (
              <Popconfirm
                title="Are you sure to delete this article?"
                okText="Delete"
                cancelText="Cancel"
                onConfirm={() => handleDelete(data.id)}
              >
                <Button danger shape="circle" icon={<DeleteOutlined />} />
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  useEffect(() => {
    dispatch(fetchArticleList());
  }, [dispatch]);

  function handlePagination(page) {
    setPagination({
      ...pagination,
      page,
    });
  }

  function handlePageSizeChange(size) {
    setPagination({
      ...pagination,
      pageSize: size,
    });
  }

  async function handleDelete(id) {
    let form = { article_id: id, user_token: userInfo.user_token };
    console.log(form);
    const result = await deleteArticleAPI(form);
    if (result.status === 200) {
      message.info(result.data);
      let filteredList = articleList.filter((article) => {
        return article.id !== id;
      });
      dispatch(setArticles(filteredList));
      // dispatch(fetchArticleList())
    } else {
      message.warning("error:", result.data);
    }
  }

  return (
    <div>
      <Checkbox
        checked={showMyArticlesOnly}
        onChange={(e) => setShowMyArticlesOnly(e.target.checked)}
      >
        Show my articles only
      </Checkbox>
      <Card
        title={`There are ${
          showMyArticlesOnly ? myArticleList.length : articleList.length
        } articles in total.`}
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={showMyArticlesOnly ? myArticleList : articleList}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            onChange: handlePagination,
            total: articleList.count,
          }}
        />
        <div className="pagination-buttons">
          <Button
            type={pagination.pageSize === 5 ? "primary" : ""}
            onClick={() => handlePageSizeChange(5)}
          >
            5/page
          </Button>
          <Button
            type={pagination.pageSize === 10 ? "primary" : ""}
            onClick={() => handlePageSizeChange(10)}
          >
            10/page
          </Button>
        </div>
      </Card>
    </div>
  );
};
export default Home;
