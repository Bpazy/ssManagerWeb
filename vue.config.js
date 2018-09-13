module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: "http://localhost:8082",
    port: 8081
  }
};
