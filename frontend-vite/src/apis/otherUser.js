import { request } from "../utils";

// API about other users
export function followAPI(formData) {
  return request({
    url: `/api/follow`,
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

export function unfollowAPI(formData) {
  return request({
    url: `/api/unfollow`,
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

export function getUserInfoByNameAPI(name) {
  return request({
    url: `/api/userinfo?name=${name}`,
    method: "GET",
  })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
}
