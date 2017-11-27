<h1>Sea Net</h1>

<h3>Download:</h3>
git clone https://github.com/DoubleCG/stalk.git

<h3>Test:</h3>
<code> 
cd stalk/dist
<br>
supervisor app
</code>

<h3>Database design</h3>

<h4>When user login, load the chat lists base on the schema.</h4>
<code>
var loginlistSchema = new Schema({
    uid:String,
    recent_people:Array,
    recent_team:Array,
    star:Array,
    team:Array,
})
</code>
<h4>The record of messages of user, base on the schema.</h4>
<code>
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
</code>
<h3>More design of database based on the Mongoose is in the file (dev/mongoModel)</h3>

<br>

<h3>dev/public</h3>
<h4>cropper</h4>
<h5>precently it is useless</h5>
<h4>img</h4>
<h5>save all the important default images</h5>
<h4>js</h4>
<h5>save all the important javascript function.</h5>
<h4>less</h4>
<h5>all stylesheet are saved in this file.</h5>
<h4>voice</h4>
<h5>all voice are saved in this file.</h5>

<br>