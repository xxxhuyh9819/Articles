import axios from "axios";

const request = axios.create({
  baseURL: "http://127.0.0.1:5000",
  timeout: 5000,
});

function setCurrentUserInfo(userInfo) {
  localStorage.setItem("user_token", userInfo.user_token);
  localStorage.setItem("user_id", userInfo.user_id);
  localStorage.setItem("user_name", userInfo.user_name);
  localStorage.setItem("user_bio", userInfo.user_bio);
  localStorage.setItem("num_of_followers", userInfo.num_of_followers);
  localStorage.setItem(
    "accounts_following",
    JSON.stringify(userInfo.accounts_following)
  );
}

function getCurrentUserInfo() {
  let user_token = localStorage.getItem("user_token");
  let username = localStorage.getItem("user_name");
  let user_id = localStorage.getItem("user_id");
  let user_bio = localStorage.getItem("user_bio");
  let num_of_followers = localStorage.getItem("num_of_followers");
  let accounts_following = JSON.parse(
    localStorage.getItem("accounts_following")
  );
  return {
    user_token: user_token,
    user_name: username,
    user_id: user_id,
    user_bio: user_bio,
    num_of_followers: num_of_followers,
    accounts_following: accounts_following,
  };
}

function clearCurrentUserInfo() {
  localStorage.removeItem("user_token");
  localStorage.removeItem("user_name");
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_bio");
  localStorage.removeItem("num_of_followers");
  localStorage.removeItem("accounts_following");
}

function setAllArticles(articlesInfo) {
  localStorage.setItem("all_articles", JSON.stringify(articlesInfo));
}

function getAllArticles() {
  return JSON.parse(localStorage.getItem("all_articles"));
}

function clearAllArticles() {
  localStorage.removeItem("all_articles");
}

function clearVisitedUser() {
  localStorage.removeItem("visited_user");
}

function updateLikedArticles(liked_articles) {
  localStorage.setItem("liked_articles", JSON.stringify([...liked_articles]));
}

function clearShowArticlePreference() {
  localStorage.removeItem("show_my_articles");
}

function clearPagination() {
  localStorage.removeItem("pagination");
}

function updateAccountsFollowing(accounts_following) {
  localStorage.setItem(
    "accounts_following",
    JSON.stringify([...accounts_following])
  );
}

function clearAccountsFollowing() {
  localStorage.removeItem("accounts_following");
}

export {
  request,
  setCurrentUserInfo,
  getCurrentUserInfo,
  clearCurrentUserInfo,
  setAllArticles,
  getAllArticles,
  clearAllArticles,
  updateLikedArticles,
  clearShowArticlePreference,
  clearPagination,
  updateAccountsFollowing,
  clearAccountsFollowing,
  clearVisitedUser,
};
