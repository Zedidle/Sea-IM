<h1>Sea Net</h1>

<h3>Download:</h3>
git clone https://github.com/DoubleCG/seanet.git

<h3>Test:</h3>
<pre> 
cd seanet/dist
supervisor app
</pre>

<h3>Database design</h3>

<h4>When user login, load the chat lists base on the schema.</h4>
<pre>
var loginlistSchema = new Schema({
    uid:String,
    recent_people:Array,
    recent_team:Array,
    star:Array,
    team:Array,
})
</pre>
<h4>The record of messages of user, base on the schema.</h4>
<pre>
var messageSchema = new Schema({
    uid:String,
    mess:Object,
    // "mess" : {
    //     "0" : "0",
    //     "userId" : [
    //         {
    //             "uid" : String,
    //             "to" : String,
    //             "type" : String,
    //             "headImg" : String,
    //             "name" : String,
    //             "time" : String,
    //             "content" : String,
    //             "introduce" : String,
    //         },
    //         ...
    //     ],
    //     ...
    // },
})
</pre>
<h3>More design of database based on the Mongoose is in the file (dev/mongoModel)</h3>

<br>

<h3>dev/public</h3>
<h4>cropper : precently it is useless</h4>
<h4>img : save all the important default images</h4>
<h4>js : save all the important javascript function</h4>
<h4>less : all stylesheet are saved in this file</h4>
<h4>voice : all voice are saved in this file</h4>

<br>