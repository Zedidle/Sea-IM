<template>
	<div id='LRform' v-show='!isLogin'>
    <form>
      <div class="title"> {{ loginOrRegist==='l'?'登录':'注册' }} </div>

      <div :style='contentS'>
       <div>
         <span class='lr-span'> ID: </span>
         <input
         class='lr-input'
         @focus='focusUid'
         @blur='blurUid'
         v-model.trim='uid'
         placeholder="输入ID"
         >
       </div>
       <b :style='tipUidS'>{{tipUid}}</b>
       <br>

       <div>
         <span class='lr-span'> 密码: </span>
         <input
         class='lr-input'
         @focus="focusPw"
         @blur='blurPw'
         type="password"
         v-model.trim='pw'
         placeholder="输入密码"
         >
       </div>
       <b :style='tipPwS'>{{tipPw}}</b>

       <br>
       <transition name='fadeX50'>
        <div v-if='loginOrRegist==="r"'>
          <span class='lr-span'>重复密码:</span>
          <input
          class='lr-input'
          @focus="focusPww"
          @blur='blurPww'
          type="password"
          v-model.trim='pww'
          placeholder="确认密码"
          >
        </div>
      </transition>
      <transition name='fadeX50'>
       <b v-if='loginOrRegist==="r"' :style='tipPwwS' >{{tipPww}}</b>
     </transition>

   </div>

   <div id='chooseRL'>
    <input type="button" :style='lBtnS' @click='toLogin' v-model="lBtnText">
    <input type="button" :style='rBtnS' @click='toRegist' v-model="rBtnText">
  </div>
</form>

<transition name='bounce'>
  <success-regist v-show='isSuccessRegist' ></success-regist>
</transition>
</div>
</template>

<script>
	
  import $ from 'jquery';
  import {mapState,mapMutations} from 'vuex';
  import successRegist from './children/successRegist.vue';

  export default{
   data(){
    return{
     LOR:'l',

     lBtnText:'登录',
     rBtnText:'注册',

     tip:null,
     regUid:/^\w{6,16}$/,
     regPw:/^.{6,14}$/,

     uid:'',
     pw:'',
     pww:'',

     tipUid:'',
     tipPw:'',
     tipPww:'',

     uidOk:false,

     tipUidS:{
       color:'green',
     },
     tipPwS:{
       color:'green',
     },
     tipPwwS:{
       color:'green',
     },
   }
 },
 components:{
  successRegist,
},
computed:{
  ...mapState([
   'loginOrRegist',
   'isLogin',
   'isSuccessRegist',
   ]),

  lBtnS(){
   return{
    float:'left',
    width:this.LOR === 'l'?'80%':'15%',
  }
},

rBtnS(){
 return{
  float:'right',
  width:this.LOR === 'r'?'80%':'15%',
}
},

contentS(){
 return {
  padding:'10px',
  height:(this.LOR === 'l'?'5':'8') + 'rem',
  overflow: 'hidden',
  transition:'height .5s', 
}
},


flagUid:function(){
  return this.regUid.test(this.uid);
},
flagPw:function(){
  return this.regPw.test(this.pw);
},
flagPww:function(){
  return this.same(this.pw,this.pww);
},



},
methods:{

  ...mapMutations([
    'startLogin',
    'startRegist',
    'toLogin',
    'toggleRegistS',
    'getAllLoginData',
    ]),

  same:function(v1,v2){
   return v1===v2;
 },

 toLogin:function(){
   if(this.LOR ==='l'){
    this.lSubmit();
  }else{
    this.LOR = 'l';
    this.startLogin();
  }

},
toRegist:function(){
 if(this.LOR ==='r'){
  this.rSubmit();
}else{
  this.LOR = 'r';
  this.startRegist();
}
},

lSubmit:function(){

  if(this.uid === '' || this.pw === '') return; 

  let vm = this;
  if(vm.flagUid && vm.flagPw){
    $.get('/loginJudge', {uid: vm.uid, password: vm.pw},j=>{
      if(j==='l'){
        vm.lBtnText = '帐号已登录!';
        setTimeout(()=>{ vm.lBtnText = '登录'; }, 2000);
      }else{
        if(j){
          $.post('/login',{
            uid:vm.uid,
            password:vm.pw
          },(allData)=>{
            console.log(allData);
            vm.getAllLoginData(allData); // 记录
            vm.$router.push({ path: '/m'}); // 登陸成功
          });
        }else{
          vm.lBtnText = '账号密码不匹配';
          setTimeout(()=>{ vm.lBtnText = '登录'; }, 2000);
        }
      }
    });
  }else{
    this.lBtnText = '请检查每个输入项';
    setTimeout(()=>{ vm.lBtnText = '登录'; }, 2000);
  }
},

rSubmit:function(){
  let vm = this;
  if(vm.uidOk && vm.flagUid && vm.flagPw && vm.flagPww){
    $.post('/regist',{ 
      uid:vm.uid,
      password:vm.pw 
    },(isSuccess)=>{
      if(isSuccess){

      // 记录输入账号密码，用户注册成功时可以直接登录
      vm.toggleRegistS({ uid:vm.uid, pw:vm.pw });

      vm.uid = '';
      vm.pw = '';
      vm.pww = '';
      vm.tipUid = '';
      vm.tipPw = '';
      vm.tipPww = '';
    }
  })

  }else{
    vm.rBtnText = '请检查每个输入项';
    setTimeout(()=>{ vm.rBtnText = '注册';}, 2000);
  }
},

focusUid:function(){
  this.tipUid = this.LOR=='l'?'':'字母数字组合,长度为6-16';
  this.tipUidS.color = 'green';
},
blurUid:function(){
  var vm = this;
  if(!vm.flagUid){
    vm.tipUid = 'ID非法';
    vm.tipUidS.color = 'red';
  }else{
    console.log(vm.uid)
    $.get('/blurUid',{uid:vm.uid},(bool)=>{
      if(bool){
        if(vm.LOR==='r'){
         vm.tipUid = 'ID已被注册';
         vm.tipUidS.color = 'red';
         vm.uidOk = false;
       }else{
        vm.tipUid = '';
        vm.uidOk = true;
      }
    }else{
     if(vm.LOR==='l'){
       vm.tipUid = '此ID不存在';
       vm.tipUidS.color = 'red';
     }else{
       vm.tipUid = 'ID可以注册';
       vm.tipUidS.color = 'green';
     }
   }
 });  


  }
},

focusPw:function(){
  this.tipPw = '请输入密码';
},
blurPw:function(){
  this.tipPwS.color = 'green';
  if(this.pw === ''){
    this.tipPw = '密码不能为空';
    this.tipPwS.color = 'red';
  }else if(!this.flagPw){
    this.tipPw = '密码长度不对';
    this.tipPwS.color = 'red';
  }else{
    this.tipPw = '密码可行';
    this.tipPwS.color = 'green';
  }
},

focusPww:function(){
  this.tipPww = '重复确认密码';
},
blurPww:function(){
 if(this.pww === ''){
  this.tipPww = '密码不能为空';
  this.tipPwwS.color = 'red';
}else if(!this.flagPww){
  this.tipPww = '两次密码不一样';
  this.tipPwwS.color = 'red';
}else{
  this.tipPww = '确认完成';
  this.tipPwwS.color = 'green';
}
},
}
}
</script>

<style lang='less' scoped>

  .title{
    background-color: #444;
    text-align:center;
    color:#FFF;
  }

  #LRform{
    width:20rem;
    display:inline-block;
    background:rgba(255,255,255,0.80);
    position:absolute;
    top:50%;
    left:50%;
    transform:translateX(-50%) translateY(-50%);
    overflow: hidden;

    .lr-span{
      display:inline-block;
      width:4.5rem;
      text-align: right;
    }

    .lr-input{
      width:12rem;
      text-align:center;
    }

    #chooseRL{
     margin:0.5rem;
     &:after{
      content:'';
      display:block;
      height:0;
      clear:both;
      visibility:hidden;
    }

    input{
      transition: 0.5s;
    }
  }
}

</style>