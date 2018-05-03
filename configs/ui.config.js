console.log('load ui config');

module.exports = function(){  
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
        img.src='img/bg.jpg';
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
    // document.getElementById('bg-change-btn').onclick = bodyBgController.bgChange;
}