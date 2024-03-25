import { request } from "../utils";

// API about user
export function loginAPI(formData) {
  return request({
    url: "/api/login",
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

export function registerAPI(formData) {
  return request({
    url: "/api/register",
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

export function updateUsernameAPI(formData) {
  return request({
    url: "/api/update_username",
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

export function updatePasswordAPI(formData) {
  return request({
    url: "/api/update_password",
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

export function updateBioAPI(formData) {
  return request({
    url: "/api/update_bio",
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
