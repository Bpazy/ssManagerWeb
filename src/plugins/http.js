import Vue from "vue";
import axios from "axios";
import router from "@/router";
import { Message } from "element-ui";
import { _dialog } from "@/util/util";

axios.defaults.baseURL = "/api";

Vue.prototype.$http = axios;

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 419) {
      login(error);
      return;
    }

    Message({
      message: "system error",
      type: "error"
    });
    return Promise.reject(error);
  }
);

function login(error) {
  Message({
    message: error.response.data.msg,
    type: "error"
  });
  _dialog.open({
    component: () => import("@/views/Login"),
    props: {
      loginSuccess() {
        router.go(0);
      }
    }
  });
}
