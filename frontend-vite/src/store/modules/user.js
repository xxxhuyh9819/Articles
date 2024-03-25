import { createSlice } from "@reduxjs/toolkit";
import {
  loginAPI,
  registerAPI,
  updateUsernameAPI,
  updateBioAPI,
} from "../../apis/user";
import {
  clearAllArticles,
  clearCurrentUserInfo,
  clearPagination,
  clearShowArticlePreference,
  clearVisitedUser,
  getCurrentUserInfo,
  setCurrentUserInfo,
} from "../../utils";

const userStore = createSlice({
  name: "user",
  initialState: {
    userInfo: getCurrentUserInfo() || {},
  },

  reducers: {
    setLoginCredentials(state, action) {
      state.userInfo = action.payload;
      setCurrentUserInfo(action.payload);
    },

    clearLoginCredentials(state) {
      state.userInfo = {};
      clearCurrentUserInfo();
      clearShowArticlePreference();
      clearPagination();
      clearAllArticles();
      clearVisitedUser();
    },
  },
});

const { setLoginCredentials, clearLoginCredentials } = userStore.actions;

const userReducer = userStore.reducer;

const fetchLoginInfo = (loginForm) => {
  return async (dispatch) => {
    const res = await loginAPI(loginForm);
    if (res.status === 200) {
      dispatch(setLoginCredentials(res.data));
    }
    return res;
  };
};

const fetchRegisterInfo = (registerForm) => {
  return async (dispatch) => {
    const res = await registerAPI(registerForm);
    if (res.status === 200) {
      dispatch(setLoginCredentials(res.data));
    }
    return res;
  };
};

const updateUsername = (updateForm) => {
  return async (dispatch) => {
    const res = await updateUsernameAPI(updateForm);
    if (res.status === 200) {
      dispatch(setLoginCredentials({ ...updateForm, user_name: res.data }));
    }
    return res;
  };
};

const updateBio = (updateForm) => {
  return async (dispatch) => {
    const res = await updateBioAPI(updateForm);
    if (res.status === 200) {
      dispatch(setLoginCredentials({ ...updateForm, user_bio: res.data }));
    }
    return res;
  };
};

export {
  fetchLoginInfo,
  fetchRegisterInfo,
  clearLoginCredentials,
  updateUsername,
  setLoginCredentials,
  updateBio,
};
export default userReducer;
