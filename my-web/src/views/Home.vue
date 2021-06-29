<template>
  <div class="home">
    <div>
      <div>
        <select>
          <option>0</option>
          <option>1</option>
        </select>
      </div>
      <div class="input-box">
        <div :key="index" v-for="(item, index) in list">
          <span class="name">{{ item.name1 }}</span><input class="input" type="text" />
          <span class="name">{{ item.name2 }}</span><input class="input" type="text" />
          <button v-if="index + 1 === list.length" @click="addItem">
            添加
          </button>
          <!-- <button v-if="index !== 0" @click="delItem(index)">删除</button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      list: [{ name1: "板块/个股", name2: "数值" }],
    };
  },
  methods: {
    addItem() {
      this.list.push({ name1: "板块/个股", name2: "数值" });
    },
    delItem(i) {
      this.list.splice(i, 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.input-box{
  width: 600px;
  margin: 10px auto 0;
  padding: 10px 0;
  background-color: #f2f2f2;
  box-shadow: 8px 8px 10px rgba($color: #000000, $alpha: 0.2);
  text-align: left;
  .name{
    margin-right: 20px;
  }
  .input{
    margin-right: 20px;
    border-radius: 3px;
    &:hover{
      border-color: rgb(53, 144, 230);
    }
  }
}
</style>