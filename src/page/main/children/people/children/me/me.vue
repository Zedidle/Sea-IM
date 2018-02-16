<template>
     <div 
          id='me'
     >
          <img :src="userInfo.headImg" class="headImg">
          <div><b>{{userInfo.uid}}</b></div>
          <input class="name" v-model='userInfo.name' placeholder="name">
          <input class="birthday" v-model='userInfo.birthday'  placeholder="birthday">
          <input class="hobby" v-model='userInfo.hobby'  placeholder="hobby">
          <textarea class="introduce" v-model='userInfo.introduce'  placeholder="introduce"></textarea>
     </div>
</template>


<script>

import {mapState,mapMutations} from 'vuex';

     export default {
          data(){
               return{

               }
          },
          computed:{
               ...mapState([
                    'userInfo',

               ]),
          },

          methods:{

               ...mapMutations([

               ]),

               showPersonHeadForm:function(){
                  $('#peopleHeadForm')[0].style.display = 'block';
               },
               showCheckImg:function(){
                    $('#checkImg')[0].style.height = '200px';
               },
               hideCheckImg:function(){
                    $('#checkImg')[0].style.height = '0px';
               },
               checkImg:function(e){
                    var r = new FileReader();
                    // this.headImageData = e.target.files[0];
                    // console.log(this.headImageData);
                    r.readAsDataURL(e.target.files[0]);
                    var t = this;
                    r.onload = function(e){
                         t.showCheckImg();
                         $('#checkImg')[0].src=this.result;
                    };
               },
               hideHeadForm:function(){
                    this.hideCheckImg();
                    $('#peopleHeadForm')[0].style.display = 'none';
               },

               headImageUpdate:function(event){
                    var formData = new FormData();

                    var vm = this;               
                    $.ajax({
                         type: 'post',
                         url: '/peopleImageUpdate',
                         data: formData,
                         mimeType: "multipart/form-data",
                         contentType: false,
                         cache: false,
                         processData: false,
                         success:function (headImagePath) {
                              vm.hideHeadForm();               
                              $('#headImg')[0].src = headImagePath;
                         }
                    });
               },


               warnItem:function(item){
                    item.css('border-color','red');
                    setTimeout(function(){
                         item.css('border-color','transparent');
                    },3000);
               },

               subBtnTextActive:function(text){
                    this.subBtnText = text;
                    var t = this;
                    setTimeout(function(){
                         t.subBtnText = '更新';
                    },3000);
               },

               textUpdate:function(){
                    if(this.name.length>10){
                         this.warnItem($('#name'));
                         this.subBtnTextActive('昵称字数过长');
                    }else if(this.introduce.length>60){
                         this.warnItem($('#introdushoe'));
                         this.subBtnTextActive('简介字数不能超过6０');
                    }else{

                         var data = {
                              uid:UID,
                              name:this.name,
                              introduce:this.introduce,
                              sex:this.sex,
                              hobby:this.hobby,
                              birthday:this.birthday
                         };

                         textDataFilter(data);
                         var t = this;
                         $.post('/peopleTextUpdate',data,function(info){
                              t.name = info.name;
                              t.introduce = info.introduce;
                              t.sex = info.sex;
                              t.hobby = info.hobby;
                              t.birthday = info.birthday;
                              t.subBtnTextActive('更新成功');
                         });
                    } 
               },
          }
     }

</script>


<style lang='less' scoped>
     #me{
          text-align: center;
          padding-top:10px;
          .headImg{
               border-radius: 50%;
               width:80px;
               height:80px;
               border:1px solid #999;
               cursor:pointer;
               margin-bottom:10px;
               
          }
          input{
               margin:5px 0;
               width:80%;
               text-align: center;
               background: transparent;
               border:1px solid transparent;
               &:hover{
                    border-bottom-color:#7CC;
               };
          }
          textarea{
               width:90%;
               text-align: center;
               background: transparent;
               border:1px solid transparent;
               &:hover{
                    border-color:#7CC;
               };
          }
     }

</style>