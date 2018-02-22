<h1>Sea Net</h1>
<h3>版本说明：</h3>
<pre>
	每次提交一个小bug则增加0.0.0.1
	每次提交一个新功能则增加0.1
	每次提交10个功能后将有一次代码review，整合后将进入全新版本，则+1.0.0.0
</pre>
<br>

<h3>Download</h3>
git clone https://github.com/DoubleCG/seanet.git

<h4>Start</h4>
<pre>cd seanet
npm install
npm run sup
</pre>

<br>
<h2>技术栈</h2>
<p>Vue2.0：构建客户端页面</p>
<p>Socket.io：实现消息实时发送</p>
<p>Express: 服务端开发框架</p>
<p>Gulp: 项目构建工具</p>
<p>Less: CSS预编译语言</p>
<p>MongoDB: NoSQL数据库,支持多变的消息结构</p>
<p>pm2: 服务端使用pm2部署，常驻进程 </p>
<p>nginx：服务端使用nginx代理端口转发</p>






<h3>Part of test</h3>
<p>1.Base on the test data(come from test/setData.js),Users talk with each other...100% 2018.02.22</p>




<p>2.Regist and login directly, maybe it hide a bug...100% 2018.02.22</p>
<p>then find user by the people search component, and start to talk with each other...100% </p>
