var MessLisComponent = {
  props:{
    type:{
      type:String,
      require:true
    },
    info:{
      type: Array,
      require: true,
      validator: function(value){
        return value !== null;
      }
    }
  },
  template:
    `<ul
      v-bind:id='type'
    >
      <li
        v-for='i in info'
        :key='i.uid'
        v-on:click='openMessage($event,i.uid,i.level,i.name,i.unread)'
        v-bind:style='liHeight(i.level)'
      >
        <div class='info'>
          <div class='name'>
            {{i.name}} 
            <span class="badge" v-show='showBadge(i.unread)'>{{i.unread}}</span>
          </div>

          <div class='li_type'>
            <span v-if=i.level>team</span>
            <span v-else>people</span>
          </div>

          <span class='uid' >{{i.uid}}</span>
          <div class='introduce'>{{i.introduce}}</div>
        </div>

        <div
          class='avator'
          v-bind:style='avatorStyle(i.level)'
        >
          <img v-bind:src=i.headImg>
        </div>
      </li>
    </ul>`,
  data:function(){
    return {

    };
  },
  computed:{

  },
  methods:{
    showBadge:function(badgeNumber){
      return Boolean(badgeNumber);
    },
    liHeight:function(havelevel){
      var h = this.type==='recent'?
              havelevel?'80':'50':
              this.type==='star'?'60':'100';
      return {
        height:h+'px',
        overflow:'hidden'
      };
    },
    avatorStyle:function(havelevel){
      var w,b_radius;
      switch(this.type){
        case('recent'):{
          w = havelevel?'78':'50';
          b_radius = havelevel?'0':'50';
          break;
        }
        case('star'):{
          w='60';
          b_radius='50';
          break;
        }
        case('team'):{
          w='90';
          b_radius='0';
          break;
        }
      }        
      return { 
        width:w+'px',
        borderRadius:b_radius+'%'
      };
    },

    subUnreadInDB:function(li_uid,haslevel){
      var data = {
        type: haslevel?'team':'people',
        uid: UID,
        to: li_uid,
        checked: true
      };
      $.post('/unReadTo0',data);
    },


    //  当某个messli被点击时，触发该方法
    //  event:触发的事件
    //  liUid:触发事件的对象所需要的对应聊天ID
    //  hasLevel:只有团队才有等级,判断是否是一个团队对象
    //  receiverName:对应接收者的名称，用于聊天框顶部标明在和谁聊天
    //  unread:未读数量,根据未读数量截取聊天记录中的对应消息
    openMessage:function(event, liUid, hasLevel, receiverName, unread){
      main.moreinfoSeen = false;
      // this.$emit('dealU', liUid, hasLevel);

      console.log(arguments);

      main.dealUnread(liUid,hasLevel);
      this.subUnreadInDB(liUid, hasLevel);

      main.messtype = hasLevel?'team':this.type;

      main.messageframeSeen = true;

      $('.messageframe')[0].style.height = '100%';
      $('#messageframe-cont')[0].innerHTML = '';

      main.nameOfmessageframe = receiverName;

      main.messto = liUid;

      console.log(typeof unread);
      console.log('unread:'+unread);
      if(unread){
        this.getUnreadMess(main.messto, unread, main.messtype);
      }
    },

    getUnreadMess:function(getUid,unread,type){
      var data = {
        uid:UID,
        getUid:getUid,
        unread:unread,
        type:type
      };

      console.log('Data of get unread Messages:');
      console.log(data);

      $.get('/getUnreadMess', data, function(d){
        for(i=0;i<d.length;i++){
          main.createMessDiv(d[i], false);
        }
      });
    },
  },
};