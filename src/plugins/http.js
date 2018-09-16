import Vue from "vue";
import axios from "axios";
import { Message } from "element-ui";
import { _dialog } from "@/util/util";

axios.defaults.baseURL = "/api";

Vue.prototype.$http = axios;

axios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
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
      async confirm(form) {
        const result = (await axios.post("/login", {
          username: form.username,
          password: form.password
        })).data;
        if (result.code === "Ok") {
          _dialog.close();
          location.reload();
        } else {
          form.password = "";
          Message({
            message: result.msg,
            type: "info"
          });
        }
      },
      cancel() {
        _dialog.close();
      }
    }
  });
}
