<template>
  <div class="home">
    <div>
      <el-button type="primary" icon="el-icon-refresh" circle @click="load" :loading="loading"></el-button>
    </div>
    <p v-for="item of list" :key="item.port">{{item.port}}({{item.alias}}): {{item.usage | readable}}</p>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      list: [],
      loading: false
    };
  },
  async created() {
    this.load();
  },
  methods: {
    async load() {
      this.loading = true;
      this.list = (await this.$http.get("/list")).data;
      this.loading = false;
    }
  },
  filters: {
    readable(usage) {
      return `${(usage / 1024 / 1024).toFixed(2)}MB`;
    }
  }
};
</script>
