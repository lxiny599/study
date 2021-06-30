<template>
  <div class="home">
    <div>
      <div>
        <select class="select">
          <option>0</option>
          <option>1</option>
        </select>
      </div>
      <div class="input-box">
        <div
          :key="index"
          v-for="(item, index) in list"
          class="input-item"
        >
          <span class="name">{{ item.name1 }}</span><input
            class="input"
            type="text"
          />
          <span class="name">{{ item.name2 }}</span><input
            class="input"
            type="text"
          />
          <div
            class="add"
            v-if="index + 1 === list.length"
            @click="addItem"
          >+</div>
          <!-- <button v-if="index !== 0" @click="delItem(index)">删除</button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      list: [{ name1: '板块/个股', name2: '数值' }],
    }
  },
  methods: {
    addItem() {
      this.list.push({ name1: '板块/个股', name2: '数值' })
    },
    delItem(i) {
      this.list.splice(i, 1)
    },
  },
}
</script>

<style lang="scss" scoped>
.select {
  width: 60px;
  height: 24px;
}
.input-box {
  width: 600px;
  margin: 10px auto 0;
  padding: 10px;
  background-color: #f2f2f2;
  box-shadow: 8px 8px 10px rgba($color: #000000, $alpha: 0.2);
  text-align: left;
  .input-item {
    margin-bottom: 6px;
    .name {
      margin-right: 20px;
    }
    .input {
      margin-right: 20px;
      border-radius: 3px;
      &:hover {
        border-color: rgb(53, 144, 230);
      }
    }
    .add {
      display: inline-block;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #fff;
      line-height: 20px;
      text-align: center;
      cursor: pointer;
    }
  }
}
</style>