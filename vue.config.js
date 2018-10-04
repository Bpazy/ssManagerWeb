module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      "/ws": {
        target: "http://localhost:8082",
        ws: true,
        changeOrigin: true
      },
      "/api": {
        target: "http://localhost:8082"
      }
    },
    port: 8081
  }
};
