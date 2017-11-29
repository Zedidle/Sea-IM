const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const jsonParser = bodyParser.json();
const router = express.Router()
const server = require('http').Server(app);
const io = require('socket.io')(server);

router.get('/',(req,res)=>{
	res.render('test.ejs',{});
})

module.exports = router;  