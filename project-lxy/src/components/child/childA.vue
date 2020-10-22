<template>
  <div id="childA">
    <h1>我是组件A</h1>
    <button @click="transfrom">点我让组件B接收到数据</button>
    <p>因为你点了B,所以我的信息发生了变化：{{BMessage}}</p>
  </div>
</template>