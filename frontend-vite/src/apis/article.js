import { request } from "../utils";

// API about articles

export function getArticlesAPI() {
  return request({
    url: "/api/articles",
    method: "GET",
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

export function getArticleByIdAPI(id) {
  return request({
    url: `/api/details?id=${id}`,
    method: "GET",
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

export function publishNewArticleAPI(formData) {
  return request({
    url: "/api/new_article",
    method: "POST",
    data: formData,
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

/**
 * check if the article entered belongs to the logged in user
 * if so, he can update it.
 * if not, he can not update it
 * used in Update article page
 * @param id the article's id
 * @param token the logged in user's token
 */
export function checkArticleAPI(id, token) {
  return request({
    url: `/api/check_article?id=${id}&user_token=${token}`,
    method: "GET",
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

export function updateArticleAPI(formData) {
  return request({
    url: "/api/update_article",
    method: "PUT",
    data: formData,
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}

export function deleteArticleAPI(formData) {
  return request({
    url: `/api/delete_article`,
    method: "DELETE",
    data: formData,
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}
