import Vue from "vue";
import axios from "axios";

axios.defaults.baseURL = "/api";
axios.defaults.timeout = 5000;

Vue.prototype.$http = axios;
