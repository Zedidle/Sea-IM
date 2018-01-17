var people = new Vue({
     el:'.container',
     data:{
          name:name,
          introduce:introduce,
          sex:sex,
          hobby:hobby,
          birthday:birthday,
          subBtnText:'更新',
          // headImageData:''
     },
     methods:{
          showPeopleHeadForm:function(){
		   $('#peopleHeadForm')[0].style.display = 'block';
          },

          backToMainPage:function(){
               zPost('/main',{
                    uid:Uid
               });
          },

          showCheckImg:function(){
               $('#checkImg')[0].style.height = '200px';
          },
          hideCheckImg:function(){
               $('#checkImg')[0].style.height = '0px';
          },

          hideHeadForm:function(){
               this.hideCheckImg();
               $('#peopleHeadForm')[0].style.display = 'none';
          },

          headImageUpdate:function(event){
               var formData = new FormData();
               formData.append('avator', $('#avatorInput')[0].files[0]);
               formData.append('uid',Uid);

               var t = this;               
               $.ajax({
                    type: 'post',
                    url: '/peopleImageUpdate',
                    data: formData,
                    // mimeType: "multipart/form-data",
                    contentType: false,
                    cache: false,
                    processData: false,
                    success:function (headImagePath) {
                         t.hideHeadForm();               
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
                         uid:Uid,
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
          }
     }
});