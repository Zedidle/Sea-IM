Vue.component('head-form',{
      props:['uid'],
      template:`
      <form action="/teamsI" id='teamHeadForm' method='post' enctype='multipart/form-data'>
        <p>更新头像:</p>
        <input type="file" name='avator' class="btn btn-default" id='avator'>
        <button id='headUpdate' v-on:click='headUpdate' class="btn btn-success">保存头像</button>
      </form>

      `,
      data:function(){
        return {
        }
      },
      methods:{
        headUpdate:function(){
          var avator = $('#avator').val();
          if(!avator.length){
            $('#avator').css('border','solid 1px #449933'); return false;
          }else{
            var input = document.createElement('input');
            input.style.display = 'none';
            input.name = 'uid';
            input.value = this.uid;
            var teamHeadForm = $('#teamHeadForm');
            teamHeadForm.append(input);
            teamHeadForm.submit();
          }
        },
      }
})


var teams = new Vue({
  components:{
    'back-botton':{
      props:['uid'],
      template:`  
      <div class="row">
        <div class="col-md-12">
          <button style='float:right;margin:5px;' v-on:click='back' class="btn btn-default">返回主页</button>
        </div>
      </div>`,
      data:function(){
        return {
          uidEnsure:{uid : this.uid},

        }
      },
      methods:{
        back:function(){
          console.log(this.uid);
          formPostUrl('/main',this.uidEnsure);
        }
      }
    },

     'text-info':{
      props:['uid','name','level','membernumber','introduce'],
      template:`
      <div id='brief'>
        <div id='uid'>ID: {{uid}}</div>
        <div>团队名称: <textarea id='name'>{{name}}</textarea></div>

        <div id='level'>等级:  {{level}}</div>
        <div id='membernumber'>人数:  {{membernumber}}</div>
        <h3>简介:</h3>
        <textarea id='introduce'>{{introduce}}</textarea>
        <button id='textUpdate' style='float:right;width:80px;height:30px;margin:10px 0;' v-on:click='textUpdate' class="btn btn-primary">更新</button>
      </div>
      `,
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
            var data = {uid:this.uid, name:name, introduce:introduce, }
            text_filter(data);
            console.log(data.introduce)
            postChangeText('/teamsT',data,this.textUpdate_callback);
          }
        },
        textUpdate_callback(data){
          $('#name').val(data.name);

          $('#introduce').val(data.introduce);
        }
      }
    }
  },
  el:'#teams',
  data:{
  },
  methods:{
    showTeamHeadform:function(){
      $('#teamHeadForm').css('display','block');
    }
  }
});

