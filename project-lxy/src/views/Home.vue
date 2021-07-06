<template>
  <div class="body">
    <div class="time">金樽对月（4月10日）</div>
    <div class="register">
        <img class="logo" src="../assets/img/logo.png" alt="">
        <ul class="register-wrapper">
            <li class="register-list pen">
                <span>服务器</span>
                <input id="isAlert" readonly="readonly" v-model="serveTxt" type="text" placeholder="请选择服务器" @click="showAlert">
            </li>
            <li class="register-list">
                <span>账&nbsp;&nbsp;&nbsp;&nbsp;号</span>
                <input  v-model="username"  placeholder="请输入账号" type="text">
            </li>
            <li class="register-list">
                <span>密&ensp;&ensp;&ensp;码</span>
                <input v-model="password" placeholder="请输入密码" type="text">
            </li>
        </ul>
        <div class="content">
            <div class="choose-wrapper">
                <div class="choose"></div>
                <span>记住密码</span>
            </div>
            <div class="choose-wrapper">
                <div class="choose"></div>
                <span>密码保护</span>
            </div>
            <div class="choose-wrapper">
                <div class="choose"></div>
                <span>我同意</span>
            </div>
            <a href="">多益游戏许可及服务协议</a>
        </div>
        <div id="btn" class="btn" @click="login">登录游戏</div>
    </div>
    <div id="alert" class="alert" v-show="isAlert">
        <div class="head">
            <span class="head-title">服务区选择</span>
            <div class="close" id="close" @click="closeAlert">×</div>
            <div id="name" class="list">
              <div :class="{'active':current==index}" :key="index" v-for="(item,index) in arr" class="list-name" @click="choose(item)">{{item.name}}</div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Home',
  components: {
  },
  data(){
    return{
      arr :[
        {name:'艾欧尼亚',id:0},
        {name:'德玛西亚',id:1},
        {name:'水晶之痕',id:2},
        {name:'无畏先锋',id:3},
        {name:'班德尔城',id:4},
        {name:'裁决之地',id:5},
        {name:'黑色玫瑰',id:6},
        {name:'征服之海',id:7},
        {name:'诺克萨斯',id:8},
        {name:'扭曲丛林',id:9}
      ],
      isAlert:false,
      current:null,
      serveTxt:null,
      username:null,
      password:null
    }
  },
  created(){
  },
  methods:{
    showAlert(){
      this.isAlert = true
    },
    closeAlert(){
      this.isAlert = false
    },
    choose(data){
      this.current=data.id
      this.serveTxt = data.name
      this.isAlert = false
    },
    login(){
      console.log(111)
      if(!this.serveTxt){
          alert('请选择服务区');
          return false
      }
      if(!this.username){
          alert('请输入账号');
          return false
      }
      if(!this.password){
          alert('请输入密码');
          return false
      }
      if(this.username=='admin'&&this.password=='admin'){
          alert(`${this.serveTxt}欢迎你`);
      }else{
          alert('账号或密码错误');
      }
    }
  }
}
</script>

<style scoped>
        .body{
            position: relative;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 100px 0 50px;
            min-width: 900px;
            min-height: 500px;
            background-image:url("../assets/img/timg.jpg");
            background-repeat:no-repeat;
            background-size:cover;
        }
        li{
            list-style: none;
        }
        .time{
            position: absolute;
            padding: 4px 4px 6px 26px;
            right: 0px;
            top: 50px;
            border-radius: 20px 0 0 20px;
            color: #e5be56;
            background-color: rgba(71, 80, 85, 0.1);
        }
        .time::after{
            position: absolute;
            left: -8px;
            top: -8px;
            width: 20px;
            line-height: 20px;
            border-radius: 50%;
            font-size: 16px;
            text-align: center;
            color: #fff;
            background-color: #f00;
            content: '新';
        }
        .register{
            /* position: absolute; */
            display: flex;
            flex-direction: column;
            /* justify-content: center; */
            align-items: center;
            margin: 0 auto;
            padding-top: 30px;
            width: 800px;
            height: 500px;
            background-color: rgba(85, 103, 123, 0.1);
        }
        .logo{
            width: 340px;
            height: auto;
        }
        .register-wrapper{
            /* display: flex; */
            padding: 0;
        }
        .register-list{
            margin-bottom: 20px;
        }
        .register-list span{
            color: #6f859d; 
        }
        .register-list input{
            width: 220px;
            height: 20px;
            padding-left: 8px;
            outline: none;
            border: none;
            border-radius: 4px;
            color: #fff;
            background: #6f859d;
        }
        .content{
            display: flex;
            flex-wrap: wrap;
            width: 220px;
            margin-left: 50px;
            font-size: 12px;
        }
        .choose-wrapper{
            display: flex;
            align-items: center;
            margin-right: 20px;
            margin-bottom: 10px;
        }
        .choose{
            position: relative;
            width: 16px;
            height: 16px;
            margin-right: 4px;
            border-radius: 4px;
            background: #6f859d;
        }
        .choose::after{
            position: absolute;
            width: 20px;
            height: 20px;
            top: -4px;
            left: -1px;
            background-image: url("../assets/img/tick.png");
            background-repeat:no-repeat;
            background-size:cover;
            content: '';
        }
        .btn{
            margin-top: 50px;
            width: 90px;
            height: 40px;
            line-height: 38px;
            border-radius: 4px;
            text-align: center;
            color: #9d3f0b;
            background-color: #f8d567;
        }
        .pen{
            position: relative;
        }
        .pen::after{
            position: absolute;
            top: 2px;
            right: 2px;
            content: '';
            width: 20px;
            height: 20px;
            background-image: url("../assets/img/pen.png");
            background-repeat: no-repeat;
            background-size: cover;
        }
        .alert{
            position: absolute;
            top: 240px;
            left: 50%;
            transform: translateX(-50%);
            width: 500px;
            height: 300px;
            overflow: hidden;
            border-radius: 6px;
            background: #fff;
        }
        .head{
            position: relative;
            width: 100%;
            height: 30px;
            background-color: #353335;
        }
        .head-title{
            padding-left: 10px;
            line-height: 28px;
            color: #fff;
        }
        .close{
            position: absolute;
            top: -7px;
            right: 6px;
            font-size: 30px;
            color: #aaa;
            cursor: pointer;
        }
        .list{
            display: flex;
            flex-wrap: wrap;
            padding: 20px;
        }
        .list-name{
            width: 112px;
            height: 40px;
            margin: 0.5px;
            line-height: 40px;
            text-align: center;
            border: 1px solid #ccc;
            cursor: pointer;
        }
        .active{
          background-color:#f8d17a 
        }
        input::-webkit-input-placeholder{
            color: #fff;
        }
        input:focus::-webkit-input-placeholder {
            color: transparent;
            /* transparent是全透明黑色(black)的速记法，即一个类似rgba(0,0,0,0)这样的值 */
        }
</style>