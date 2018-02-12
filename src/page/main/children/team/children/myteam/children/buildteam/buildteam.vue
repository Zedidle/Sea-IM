<template>
    <form
        class="bs-example bs-example-form"
        id="teamForm"
        action="/successBuildTeam"
        role='form' 
        method='post'
    >
        <div id='welcome'>创建团队</div>
        <div class="input-group">
            <span
                class="input-group-addon"
                style='width:80px;'
            >名称
            </span>
            <input
                name='teamname'
                v-on:focus='focusTeamname'
                v-on:blur='blurTeamname'
                v-model.trim='teamname'
                class="form-control"
            >
        </div>

        <div 
            class='tip'
            id='tipTeamname'
        >{{tipTeamname}}
        </div>

        <br>

        <div class="input-group">
            <span
                class="input-group-addon"
                style='width:80px;'
            >口令
            </span>
            <input
                id='password'
                name='password'
                v-on:focus='focusPassword'
                v-on:blur='blurPassword'
                v-model.trim = 'password'
                type='password'
                class="form-control"
            >
        </div>

        <div
            class='tip'
            id='tipPassword'
        >{{tipPassword}}
        </div>

        <br>
          <div class="input-group">
            <span
                class="input-group-addon"
                style='width:80px;'
            >重复口令
            </span>
            <input
                id='password1'
                v-model.trim = 'password1'
                v-on:focus= 'focusPassword1'
                v-on:blur='blurPassword1'
                type="password"
                class="form-control"
            >
            </div>

            <div 
                class='tip'
                id='tipPassword1'
            >{{tipPassword1}}
            </div>

        <br>

        <button
            v-on:click="formSubmit"
            id="submitBtn"
            type="button"
            class="btn btn-primary"
        >建立
        </button>

        <button
            id="backBtn"
            v-on:click="backToMainPage"
            type="button"
            class="btn btn-warning"
        >取消
        </button>

        <br clear='both'>
    </form>
</template>


<script>
import {mapState,mapMutations} from 'vuex';

export default {
  data(){
    return {
        regTeamname:/^.{2,10}$/,
        regPassword:/^.{3,8}$/,

        teamname:'',
        password:'',
        password1:'',

        tipTeamname:'',
        tipPassword:'',
        tipPassword1:'',

        flagTeamname:false,
        flagPassword:false,
        flagPassword1:false,

        welcomeStyle:
            fontSize:'24px',
            color:'#556',
            textAlign:'center',
            margin:'10px',
        },
        teamFormStyle:{
            margin:'0 auto',
            border:'2px solid #0A74D0',
            borderTop:'25px solid #0A74D0',
            borderBottom:'10px solid #0A74D0',
            borderLeft:'2px solid #0A74D0',
            borderRight:'2px solid #0A74D0',
            boxShadow: '0 0 10px #999',
            width:'300px',
            padding:'20px',
        },
        submitBtnStyle:{
            width:'60%',
            height:'40px',
            float:'left',
        },
        backBtnStyle:{
            float:'right',
            width:'30%',
            height:'40px',
        },
        tipStyle:{
            height:'15px'
        }
    }
  },
  computed:{
    ...mapState([

    ]),
  },
  methods:{
    ...mapMutations([

    ]),
    tipOk:function(obj){
        obj.style.color = 'green';
    },
    tipAlert:function(obj){
        obj.style.color = 'red';
    },

    focusTeamname:function(){
        this.tipOk($('#tipTeamname')[0]);
        this.tipTeamname = '团队名称长度限制在2-10之间';
    },
    focusPassword:function(){
        this.tipOk($('#tipPassword')[0]);
        this.tipPassword = '口令长度限制在3-8之间';
    },
    focusPassword1:function(){
        this.tipOk($('#tipPassword1')[0]);
        this.tipPassword1 = '确认团队口令';
    },

    blurTeamname:function(){
        if(this.regTeamname.test(this.teamname)){
            this.tipTeamname = '团队名称可行';
            this.flagTeamname = true;
        }else{
            this.tipAlert($('#tipTeamname')[0]);
            this.tipTeamname = '团队名称有误';
            this.flagTeamname = false;
        }
    },
    blurPassword:function(){
        if(this.regPassword.test(this.password)){
            this.tipPassword = '密码可行';
            this.flagPassword = true;
        }else{
            this.tipAlert($('#tipPassword')[0]);
            this.tipPassword = '密码有误';
            this.flagPassword = false;
        }
    },
    blurPassword1:function(){
        if(isSame(this.password,this.password1)){
            this.tipPassword1 = '密码确认完成';
            this.flagPassword1 = true;
        }else{
            this.tipAlert($('#tipPassword1')[0]);
            this.tipPassword1 = '两次密码不一样';
            this.flagPassword1 = false;
        }
    },

    backToMainPage:function(){ 
        zPost('/main',UserEnsure);
    },

    formSubmit:function(){
        if(!(this.flagTeamname && this.flagPassword && this.flagPassword1)){
            return false;
        }
        formAddInput($('#teamForm')[0],'uid',UID);
        $('#teamForm')[0].submit();
    }
  }
}

</script>

<style lang='less' scoped>
    
</style>
