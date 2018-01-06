var teams = new Vue({
  components:{
    'text-info':{
      props:['uid','name','level','membernumber','introduce'],
      template:
        '<div id="brief">'+
          '<div id="uid">ID:{{uid}}</div>'+
          '<div>团队名称: <textarea id="name">{{name}}</textarea></div>'+
          '<div id="level">等级:{{level}}</div>'+
          '<div id="membernumber">人数:{{membernumber}}</div>'+
          '<h3>简介:</h3>'+
          '<textarea id="introduce">{{introduce}}</textarea>'+
          '<button id="textUpdate" style="float:right;width:80px;height:30px;margin:10px 0;" v-on:click="textUpdate" class="btn btn-primary">'+
            '更新'+
          '</button>'+
        '</div>',
      methods:{
        textUpdate:function(){
          var
            name = $('#name').val().trim(),
            introduce = $('#introduce').val().trim();
          if(introduce.length>80){
            $('#introduce').css('border','solid 1px red');
            $('#textUpdate').text('简介字数不能超过８０');
            setTimeout(function(){ $('button#textUpdate').text('更新'); },2000);
            return false;
          }else{
            var data = {
              uid:this.uid, 
              name:name, 
              introduce:introduce
            };
            text_filter(data);
            postChangeText('/teamsT',data,function(data){
              $('#name').val(data.name);
              $('#introduce').val(data.introduce);
              $('#textUpdate').text('修改成功');
              setTimeout(function(){ $('#textUpdate').text('更新'); },2000);
            });
          }
        },
      }
    }
  },
  el:'#teams',
  data:{
  },
  methods:{
    showTeamHeadform:function(){
      $('#teamHeadForm').css('display','block');
    },
    headUpdate:function(){
      var avator = $('#avator').val();
      if(!avator.length){
        $('#avator').css('border','solid 1px #449933'); 
      }else{
        $('#teamHeadForm').submit();
      }
    },
    showImg:function(e){
      var that = e.target;
      var img = that.nextElementSibling;
      var r = new FileReader();
      r.readAsDataURL(that.files[0]);
      r.onload = function(){
        img.src=this.result;
      };
    },
    backToMainPage:function(){
      zPost('/main',{
        uid:uid
      });
    }
  }
});