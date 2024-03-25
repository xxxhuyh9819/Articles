import { createSlice } from "@reduxjs/toolkit";
import { getArticlesAPI } from "../../apis/article";

import { getAllArticles, setAllArticles } from "../../utils";

const articleStore = createSlice({
  name: "article",
  initialState: {
    articleList: getAllArticles() || [],
  },
  reducers: {
    setArticles(state, action) {
      state.articleList = action.payload;
      setAllArticles(action.payload);
    },
  },
});

const { setArticles } = articleStore.actions;

const articleReducer = articleStore.reducer;

function fetchArticleList() {
  return async (dispatch) => {
    const res = await getArticlesAPI();
    if (res.status === 200) {
      let articles = res.data;
      dispatch(setArticles(articles));
    }
    return res;
  };
}

export { fetchArticleList, setArticles };

export default articleReducer;
