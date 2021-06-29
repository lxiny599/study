<template>
  <div class="home">
    <div>
      <select>
        <option>---请选择---</option>
        <option>0</option>
        <option>1</option>
      </select>
    </div>
    <div>
      <div
        :key="index"
        v-for="(item,index) in list"
      >
        <span>{{item.name1}}</span><input type="text"><span>{{item.name2}}</span><input type="text">
        <button
          v-if="index+1===list.length"
          @click="addItem"
        >添加</button>
        <button
          v-if="index!==0"
          @click="delItem(index)"
        >删除</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      list: [{ name1: 'name1', name2: 'name2' }],
    }
  },
  methods: {
    addItem() {
      this.list.push({ name1: 'name1', name2: 'name2' })
    },
    delItem(i) {
      this.list.splice(i, 1)
    },
  },
}
</script>
