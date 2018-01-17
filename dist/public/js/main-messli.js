var MessLis = {
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
        v-on:click='showMessageFrame($event,i.uid,i.level,i.name)'
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

    subUnreadDB:function(li_uid,haslevel){
      var data = {
        type:haslevel?'team':'people',
        uid:Uid,
        to:li_uid,
        checked:true
      };
      $.post('/unReadTo0',data);
    },

    // 当某个messli被点击时，触发该方法
    showMessageFrame:function(event, li_uid, haslevel, receiver_name){
      main.moreinfoSeen = false;

      //有没有等级说明是不是团队
      // this.$emit('dealU', li_uid, haslevel);

      var unreadNumber = main.dealUnread(li_uid,haslevel);
      this.subUnreadDB(li_uid, haslevel);

      main.messtype = haslevel?'team':this.type;

      main.isteam = main.messtype==='team';

      main.messageframeSeen = true;

      $('.messageframe')[0].style.height = '100%';
      $('#messageframe_cont')[0].innerHTML = '';

      main.nameOfmessageframe = receiver_name;

      main.messto = li_uid;

      main.getUnreadMess(main.messto, unreadNumber, main.messtype);
    },
  },
};