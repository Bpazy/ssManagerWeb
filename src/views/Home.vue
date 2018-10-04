<template>
  <div class="home">
    <div>
      <el-button type="primary" icon="el-icon-plus" @click="addRule">添加流量统计</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="addPortPassword">添加端口密码</el-button>
      <el-button type="primary" icon="el-icon-view" @click="queryPorts">查看当前端口</el-button>
    </div>

    <div v-for="(rule, index) of rules" :key="rule.port" class="item">
      <span class="alias">{{rule.port}}({{rule.alias}}): </span>
      <span class="usage">下行流量: {{rule.downstreamUsage | readable}}</span>
      <span class="usage">上行流量: {{rule.upstreamUsage | readable}}</span>
      <div class="buttons">
        <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRule(rule)">编辑</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetRule(rule)">重置</el-button>
        <el-button type="primary" icon="el-icon-delete" size="mini" @click="deleteRule(rule, index)">删除</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      rules: [],
      form: {
        port: "",
        alias: ""
      },
      addLoading: false,
      deleteLoading: false,
      addDialogFormVisible: false
    };
  },
  async created() {
    await this.initWebSocket();
  },
  methods: {
    async initWebSocket() {
      let reConnect = "";
      let pingInterval = "";

      const self = this;

      let token = "";
      try {
        token = (await this.$http.get("/token")).data;
      } catch (e) {
        console.log(e);
      }
      let ws = new WebSocket(
        `ws://${document.location.host}/ws/echo?token=${token}`
      );
      console.log("正在连接服务器");
      ws.onopen = function() {
        console.log("连接服务器成功");
        pingInterval = setInterval(() => {
          ws.send("ping");
        }, 10 * 1000);
      };
      ws.onclose = function() {
        console.log("服务器关闭");
        clearInterval(pingInterval);
        if (!reConnect) {
          reConnect = setTimeout(self.initWebSocket, 3000);
        }
      };
      ws.onerror = function() {
        console.log("连接出错");
        clearInterval(pingInterval);
        if (!reConnect) {
          reConnect = setTimeout(self.initWebSocket, 3000);
        }
      };
      ws.onmessage = function(e) {
        self.rules = JSON.parse(e.data);
      };
    },
    addRule() {
      const self = this;
      this.$dialog.open({
        component: () => import("@/views/AddSetting"),
        props: {
          async confirm(form) {
            await self.$http.post("/usage/save", {
              port: parseInt(form.port),
              alias: form.alias
            });
            self.$dialog.close();
          },
          cancel() {
            self.$dialog.close();
          }
        }
      });
    },
    addPortPassword() {
      this.$dialog.open({
        component: () => import("@/views/AddPortPassword"),
        props: {
          success() {
            this.$dialog.close();
          },
          fail() {
            this.$dialog.close();
          }
        }
      });
    },
    async deleteRule(rule) {
      try {
        await this.$confirm("此操作将导致历史记录被清空, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        const { code, msg } = (await this.$http.get(
          `/usage/delete/${rule.port}`
        )).data;
        if (code === "Ok") this.$message({ message: msg, type: "success" });
        else this.$message.error(msg);
      } catch (e) {
        console.log(e);
      }
    },
    editRule(rule) {
      const self = this;
      this.$dialog.open({
        component: () => import("@/views/AddSetting"),
        props: {
          editMode: true,
          form: {
            port: rule.port,
            alias: rule.alias
          },
          async confirm(form) {
            const { code, msg } = (await self.$http.post("/usage/edit", {
              port: parseInt(form.port),
              alias: form.alias
            })).data;
            self.$dialog.close();
            if (code === "Ok") this.$message({ message: msg, type: "success" });
            else this.$message.error(msg);
          },
          cancel() {
            self.$dialog.close();
          }
        }
      });
    },
    async resetRule(rule) {
      try {
        await this.$confirm("此操作将清空历史记录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        const { code, msg } = (await this.$http.get(
          `/usage/reset/${rule.port}`
        )).data;
        if (code === "Ok") this.$message({ message: msg, type: "success" });
        else this.$message.error(msg);
      } catch (e) {
        console.log(e);
      }
    },
    async queryPorts() {
      const ports = (await this.$http.get("/ss/queryPortPasswords")).data;
      this.$alert(ports, "端口列表", {
        confirmButtonText: "确定"
      });
    }
  },
  filters: {
    readable(usage) {
      return `${(usage / 1024 / 1024).toFixed(2)}MB`;
    }
  }
};
</script>
<style scoped>
.home {
  margin: 20px;
  white-space: nowrap;
}

.item {
  display: flex;
  height: 40px;
  line-height: 40px;
}

.alias {
  flex: none;
  width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.usage {
  flex: none;
  width: 200px;
}

.buttons {
  flex: 1;
}
</style>
