<template>
  <div class="home">
    <p v-for="item of list" :key="item.port">{{item.port}}({{item.alias}}): {{item.usage | readable}}</p>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      list: []
    };
  },
  async created() {
    this.list = (await this.$http.get("/list")).data;
  },
  filters: {
    readable(usage) {
      return `${(usage / 1024 / 1024).toFixed(2)}MB`;
    }
  }
};
</script>
