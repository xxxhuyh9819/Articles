import { UserOutlined } from "@ant-design/icons";
import "../styles/ArticleDetails.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getArticleByIdAPI } from "../apis/article";

const ArticleDetails = () => {
  const navigate = useNavigate();
  const param = useParams();
  const [article, setArticle] = useState({});

  useEffect(() => {
    async function getArticleById(id) {
      const result = await getArticleByIdAPI(id);
      const data = result.data;
      setArticle(data);
    }
    getArticleById(param.id);
  }, [param.id]);

  return (
    <div>
      <div className="article-container">
        <h2>{article.title}</h2>
        <div
          className="article-info"
          onClick={() => navigate(`/profile/${article.author}`)}
        >
          <i>
            <UserOutlined style={{ fontSize: "2rem" }} />
          </i>
          <div className="article-basic-info-container">
            <span style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
              {article.author}
            </span>
            <span style={{ color: "#aaa", fontSize: "0.7rem" }}>
              {article.create_date}
            </span>
          </div>
        </div>

        <div className="article-contents">
          <p>{article.contents}</p>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetails;
