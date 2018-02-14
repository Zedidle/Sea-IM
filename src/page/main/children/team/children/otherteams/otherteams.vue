<template>
    <div class='panel panel-default'>
        <div class='panel-heading'>
            <h3>你所加入的团队</h3>
        </div>

        <div class='panel-body'>
                
<!--                     <div class='info'>
                        <div class='id'>ID: {{i.uid}}</div>
                        <div class='teamname'>团队名称: {{i.name}}</div>
                        <div class='level'>等级: {{i.level}}</div>
                        <div class='membernumber'>成员数量: {{i.membernumber}}</div>
                        <div class='introduce'>
                            <h4>队长豪言：</h4>
                            {{i.introduce}}
                        </div>
                    </div> -->
                <!-- </div> -->
            <!-- </div> -->
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