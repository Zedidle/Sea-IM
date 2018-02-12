<template>
    <div id='teams'>
    <div class="title">
        团队信息
    </div>

    <button
        id='backToMainPage-btn'
        v-on:click='backToMainPage'
        class="btn btn-default"
    >返回主页
    </button>

    <div
        id='teamHeadForm'
    >
        <h4>更新头像:</h4>
        <div>
            <input
                id='avatorInput'
                name="avator"
                type="file"
                class="btn btn-default"
                v-on:change='checkImg'
            >
            <button
                type='button'
                class="btn btn-success"
                v-on:click='headImageUpdate'
            >保存
            </button>
            <button
                type='button'
                class="btn btn-danger"
                v-on:click='hideHeadForm'
            >取消
            </button>
            <br clear='both'>
        </div>
        <img
            id='checkImg'
        />

    </div>

    <div class="row">

        <div class="col-md-4">
            <img
                id='headImg'
                v-on:click='showTeamHeadForm'
                title="点击更新头像"
                v-bind:src= 'teamHeadImage'
            >
        </div>

        <div class="col-md-8">
            <div id="teamInfo">
                <div>
                    <b>ID:</b>
                    <span>{{teamUid}}</span>
                </div>
                <div>
                    <b>团队名称:</b>


                    <input v-if='isMyTeam' 
                        v-model.trim='teamname'
                    >
                    <span v-else>{{teamname}}</span>
                </div>
                <div>
                    <b>等级:</b>
                    <span>{{teamLevel}}</span>
                    
                </div>
                <div>
                    <b>人数:</b>
                    <span>{{teamMemberNumber}}</span>
                    
                </div>
                <h4>队长留言:</h4>
                <textarea
                    v-if='isMyTeam'
                    v-model.trim='teamIntroduce'
                >{{teamIntroduce}}
                </textarea>
                
                <div
                    v-else
                    class="textarea"
                >{{teamIntroduce}}
                </div>

                <div>
                    <button
                        style='margin-top:5px;'
                        v-on:click='textUpdate'
                        class="btn btn-primary"
                    >{{subBtnText}}
                    </button>
                </div>

            </div>
        </div>
    </div>

</div>

</template>


<script>
import {mapState,mapMutations} from 'vuex';

export default {
  data(){
    return {
      teamUid:false,
      teamname:false,
      teamPassword:false,
      teamLevel:false,
      teamIntroduce:false,
      teamMembers:false,
      teamHeadImage:false,

      subBtnText:'更新',

      styleTeamIntroduce:{
          border:'1px solid #AAA',
      },
    }
  },
  computed:{
    ...mapState([

    ]),

    teamMemberNumber:function(){
        return this.teamMembers.length;
    },
    isMyTeam:function(){
        return this.teamUid === UID;
    }
  },
  methods:{
    ...mapMutations([

    ]),
    showTeamHeadForm:function(){
        if(this.isMyTeam){
            $('#teamHeadForm').css('display','block');
        }
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
    showTeamHeadform:function(){
      $('#teamHeadForm').css('display','block');
    },

    hideHeadForm:function(){
       this.hideCheckImg();
       $('#teamHeadForm')[0].style.display = 'none';
    },

    headImageUpdate:function(event){
        var formData = new FormData();
        formData.append('avator', $('#avatorInput')[0].files[0]);
        formData.append('uid',UID);

        var vm = this;               
        $.ajax({
            type: 'post',
            url: '/teamsImageUpdate',
            data: formData,
            // mimeType: "multipart/form-data",
            contentType: false,
            cache: false,
            processData: false,
            success:function (headImagePath) {
                vm.hideHeadForm();               
                $('#headImg')[0].src = headImagePath;
            }
        });
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

    subBtnActive:function(text){
        this.subBtnText = text;
        var vm = this;
        setTimeout(function(){
            vm.subBtnText = '更新';
        },3000);
    },

    textUpdate:function(){
      if(this.teamIntroduce.length>80){

        this.subBtnActive('简介字数不能超过８０');

        return false;
      }else{
        var data = {
          uid:UID,
          name:this.teamname,
          introduce:this.teamIntroduce
        };
        textDataFilter(data);
        var vm = this;
        $.post('/teamsTextUpdate',data,function(d){

            this.teamname = data.name;
            this.teamIntroduce = data.introduce;
            vm.subBtnActive('修改成功');

        });
      }
    }
  }
}

</script>


<style lang='less' scoped>
    
</style>  