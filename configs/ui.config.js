console.log('load ui config');

module.exports = function(){  
    document.querySelector('#bg-change-btn').onmouseover = function(){
      console.log('hover');
      document.querySelector('#bg-change-btn').className = 'demo-icon icon-spin3 animate-spin';
    }
    document.querySelector('#bg-change-btn').onmouseout = function(){
      console.log('out');
      document.querySelector('#bg-change-btn').className = 'demo-icon icon-spin3';
    }
    var BgController = function(obj){
      this.v = 1;
      this.update = function(){
        this.v++;
        if(this.v === 6){
          this.v = 1;
        }
      }.bind(this);
      this.bgFlash = function(){
        var img = document.createElement('img');
        img.src='./img/background/bg'+this.v+'.jpg';
        img.onload = function(){
          setTimeout(function(){
            console.log('Finish onload!');
            obj.style.backgroundImage = 'url('+img.src+')';
          },500);
        }  
      }.bind(this);
      this.bgChange = function(){
        this.update();
        this.bgFlash();
      }.bind(this)
    }
    var bodyBgController = new BgController(document.body);
    bodyBgController.bgFlash();
    document.getElementById('bg-change-btn').onclick = bodyBgController.bgChange;
}