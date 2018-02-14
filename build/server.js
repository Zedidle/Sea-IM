const {
  ip,
  port,
  db,
  router,
  urlencodedParser,
  express,
  User,
  session,
} = require('../configs/server.config.js');

const app = express();

const server = require('http').Server(app);
server.listen(port, ip, function(){
  console.log("释放端口："+ip+':'+port);
});

// 启用通讯
require('./sockets')(server);

// 启用路由
require('./routes')(app);

// 启用数据库
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;  
mongoose.connect(db, {useMongoClient:true}, (err) => {
  if(err){
    console.log('Connect DB Fail! Error: ',err);
    process.exit(1);
  }
});

// 如果是开发阶段则让所有用户注销
if(process.env.NODE_ENV === 'development'){
  User.update({}, {$set:{login:false}}, {multi:true} ,(err) => {
    if(err) throw err;
    console.log("All users logout!");
  });
}

// 启用session
app.use(session({
  resave: false,  
  saveUninitialized: true,  
  cookie: {maxAge:36000000},  
  secret: 'test',  
}));

//设置公共静态路由
app.use(express.static('./static'));
app.use(express.static('./build/public'));

//设置视图根目录
// app.set('views',[
//   __dirname+"/static/common",
//   __dirname
// ]);

// 绑定根目录
// app.set('root',__dirname);


//设置404页
app.get('*', function(req, res){  
  res.sendFile(__dirname + '/static/common/404.html'); 
});


//-------------------------Entry--------------------------
router.get('/',(req,res)=>{ 
  res.sendFile(__dirname+'/index.html')
});